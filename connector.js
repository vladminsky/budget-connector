var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var request = require('request');
var resolve = require('path').resolve;
var fetch = require('node-fetch');
var data = require('./app/data').data;
var unpack = require('./app/data').unpack;
var monthlySum = require('./app/data').monthlySum;
var convert = require('./app/data').convert;
var fetchData = require('./app/api').fetch;

app.use(bodyParser.json());

var sources = {
    original: {
        name: 'Original TP data',
        handler: ((data) => data)
    },
    unpacked: {
        name: 'Unpacked data',
        handler: ((data) => (data.reduce(unpack, [])))
    },
    total: {
        name: 'Total data',
        handler: ((data) => (data
            .reduce(unpack, [])
            .reduce(monthlySum, [])
            .sort((a, b) => a.runningDate - b.runningDate)
            .reduce((memo, row) => {

                memo.total += row.monthlySum;
                memo.rows.push({
                    runningDate: row.runningDate,
                    monthlySum: row.monthlySum,
                    total: memo.total
                });

                return memo;

            }, {total: 0, rows: []})
            .rows))
    }
};

app.get('/logo', function(req, res) {
    res.sendFile(resolve('./logo.svg'));
});

app.get('/', function (req, res) {
    var app = {
        'name': 'Sample connector',
        'version': '2.0',
        'description': 'Sample connector to Targetprocess',
        'authentication': [
            {
                'id': 'token',
                'name': 'API Token Authentication',
                'description': 'Token authentication for access to Targetprocess',
                'fields': [
                    {
                        'optional': false,
                        'id': 'host',
                        'name': 'TP Path',
                        'type': 'url',
                        'description': 'Path to your Targetprocess instance',
                        'datalist': false
                    },
                    {
                        'optional': true,
                        'id': 'token_link',
                        'value': 'http://dev.targetprocess.com/rest/authentication#token',
                        'type': 'link',
                        'name': 'More details',
                        'datalist': false,
                        'description': 'To get your API token, navigate to [your tp instance]/api/v1/authentication'
                    },
                    {
                        'optional': false,
                        'id': 'token',
                        'name': 'API Token',
                        'type': 'text',
                        'description': 'API Token from Targetprocess',
                        'datalist': false
                    }
                ]
            }
        ],
        'sources': _.keys(sources).map((key) => ({id: key, name: sources[key].name}))
    };

    res.json(app);
});

app.post(
    '/validate',
    (req, res, next) => {
        var authInfo = req.body.fields;
        fetchData(authInfo, '/api/v1/users/loggeduser')
            .then((x) => ({name: x.FirstName + ' ' + x.LastName}))
            .then((account) => res.json(account))
            .catch(next);
    });

app.post(
    '/',
    (req, res, next) => {
        var sourceId = req.body.source;
        var authInfo = req.body.account;
        var handler = sources[sourceId].handler;

        fetchData(authInfo, '/api/v2/projects?select={id,name,customValues}')
            .then((raw) => res.json(
                handler(
                    convert(raw.items)
                    // data
                )
            ))
            .catch(next);

        // res.json(sources[sourceId].data);
    });

app.listen(process.env.PORT || 8080);