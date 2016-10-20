var parseDate = (str) => {
    return new Date(parseInt(str.replace('/Date(', '')));
};

module.exports = {

    convert: (rawData) => {
        // https://plan.tpondemand.com/api/v2/projects?prettify&select={id,name,customValues}
        return (rawData
            .reduce((memo, row) => {

                var res = {
                    id: row.id,
                    name: row.name
                };

                var fields = row.customValues.customFields;
                var requiredFields = [

                    // {name: 'Project Type', defaultValue: null},
                    // {name: 'State', defaultValue: null}

                    {name: 'Typ', defaultValue: null},
                    {name: 'Potential', defaultValue: 0},
                    {name: 'Wirksam (akt. Fiskaljahr)', defaultValue: 0},
                    {name: 'Wirksam pro Monat', defaultValue: 0},
                    {name: 'Wirksame Monate', defaultValue: 0},
                    {name: 'Wirksam ab', defaultValue: null},
                    {name: 'Wirksam bis', defaultValue: null},
                    {name: 'Gate5', defaultValue: null}
                ];

                res = requiredFields.reduce((memo, x) => {
                    var cf = fields.find((f) => f.name.toLowerCase() === x.name.toLowerCase()) || {value: x.defaultValue};
                    memo[x.name] = cf.value;
                    return memo;
                }, res);

                memo.push(res);

                return memo;
            }, [])
            .filter((row) => {
                // return true;
                return row['Wirksam ab'] !== null && row['Wirksam bis'] !== null;
            })
            .map((row) => {
                row['Wirksam ab'] = parseDate(row['Wirksam ab']);
                row['Wirksam bis'] = parseDate(row['Wirksam bis']);
                return row;
            }));
    },

    unpack: (memo, row) => {

        var days = (x) => (1000 * 60 * 60 * 24 * x);

        var getFromDate = (date) => {
            var from = new Date(date - days(-15));
            from.setUTCDate(15);
            from.setUTCHours(0, 0, 0, 0);
            return from;
        };

        var getNextDate = (prev) => {
            var next = new Date(prev - days(-30));
            next.setUTCDate(15);
            from.setUTCHours(0, 0, 0, 0);
            return next;
        };

        var unpacked = [];

        var from = getFromDate(new Date(row["Wirksam ab"]));
        var till = new Date(row["Wirksam bis"]);

        unpacked.push({
            projectId: row.id,
            projectName: row.name,
            runningDate: from,
            "Wirksam pro Monat": row["Wirksam pro Monat"]
        });

        while (getNextDate(from) < till) {
            var next = getNextDate(from);
            unpacked.push({
                projectId: row.id,
                projectName: row.name,
                runningDate: next,
                "Wirksam pro Monat": row["Wirksam pro Monat"]
            });

            from = next;
        }

        return memo.concat(unpacked);
    },

    monthlySum: (memo, row) => {

        var index = memo.findIndex((rec) => String(rec.runningDate) === String(row.runningDate));

        if (index < 0) {
            memo.push({
                runningDate: row.runningDate,
                monthlySum: row["Wirksam pro Monat"]
            });
        } else {
            memo[index].monthlySum += row["Wirksam pro Monat"];
        }

        return memo;
    },

    data: []
};
