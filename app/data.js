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

    data: [
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3135,
            "Name": "P1",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-04-01 23:59:59",
            "Create Date": "2016-10-11 16:17:50",
            "Modify Date": "2016-10-12 11:25:30",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 14,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "P1",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Projekt",
            "Potential": 1000000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 83333,
            "Wirksame Monate": 12,
            "Wirksam (akt. Fiskaljahr)": 1000000,
            "Wirksam ab": "2016-04-01 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3136,
            "Name": "P2",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-05-01 23:59:59",
            "Create Date": "2016-10-11 16:19:42",
            "Modify Date": "2016-10-11 16:47:25",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 15,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "P2",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Projekt",
            "Potential": 500000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 41667,
            "Wirksame Monate": 11,
            "Wirksam (akt. Fiskaljahr)": 458333,
            "Wirksam ab": "2016-05-01 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3137,
            "Name": "P3",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-12-31 23:59:59",
            "Create Date": "2016-10-11 16:19:47",
            "Modify Date": "2016-10-11 16:50:38",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 16,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "P3",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Projekt",
            "Potential": 2500000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 208333,
            "Wirksame Monate": 3,
            "Wirksam (akt. Fiskaljahr)": 625000,
            "Wirksam ab": "2016-12-31 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3138,
            "Name": "P4",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2017-01-30 23:59:59",
            "Create Date": "2016-10-11 16:19:52",
            "Modify Date": "2016-10-11 16:50:49",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 17,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "P4",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Projekt",
            "Potential": 1000000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 83333,
            "Wirksame Monate": 2,
            "Wirksam (akt. Fiskaljahr)": 166667,
            "Wirksam ab": "2017-01-30 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3139,
            "Name": "M1",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-08-30 23:59:59",
            "Create Date": "2016-10-11 16:20:08",
            "Modify Date": "2016-10-11 16:52:16",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 18,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "M1",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Maßnahme",
            "Potential": 250000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 20833,
            "Wirksame Monate": 7,
            "Wirksam (akt. Fiskaljahr)": 145833,
            "Wirksam ab": "2016-08-30 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3140,
            "Name": "M2",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-09-30 23:59:59",
            "Create Date": "2016-10-11 16:20:10",
            "Modify Date": "2016-10-11 16:52:45",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 19,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "M2",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Maßnahme",
            "Potential": 250000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 20833,
            "Wirksame Monate": 6,
            "Wirksam (akt. Fiskaljahr)": 125000,
            "Wirksam ab": "2016-09-30 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3141,
            "Name": "M3",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2016-10-30 23:59:59",
            "Create Date": "2016-10-11 16:20:12",
            "Modify Date": "2016-10-11 16:53:12",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 20,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "M3",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Maßnahme",
            "Potential": 250000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 20833,
            "Wirksame Monate": 5,
            "Wirksam (akt. Fiskaljahr)": 104167,
            "Wirksam ab": "2016-10-30 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        },
        {
            "ProjectID": "",
            "Entity Type": "Project",
            "ID": 3142,
            "Name": "M4",
            "Description": "",
            "Start Date": "",
            "Planned Start Date": "",
            "End Date": "",
            "Planned End Date": "2017-03-30 23:59:59",
            "Create Date": "2016-10-11 16:20:14",
            "Modify Date": "2016-10-11 16:53:40",
            "Last Comment Date": "",
            "Effort": 0,
            "Effort Completed": 0,
            "Effort To Do": 0,
            "Progress": 0,
            "Project": "",
            "Last Commented User": "",
            "Tags": "",
            "Numeric Priority": 21,
            "Owner": "Administrator Administrator",
            "Linked Test Plan": "",
            "Is Active": "True",
            "Is Product": "False",
            "Abbreviation": "M4",
            "Mail Reply Address": "",
            "Color": "",
            "Is Private": "",
            "Program": "Cargobull",
            "Process": "Cargobull",
            "Entity State": "Open",
            "Company": "",
            "Project Value": "",
            "Project Budget": "",
            "Running Cost": 0,
            "Project Scope": "",
            "Typ": "Maßnahme",
            "Potential": 250000,
            "Dauer Wirksamkeit (in Monaten)": 12,
            "Remaining Budget": "",
            "Budget": "Budget: Red",
            "Wirksam pro Monat": 20833,
            "Wirksame Monate": 0,
            "Wirksam (akt. Fiskaljahr)": 0,
            "Wirksam ab": "2017-03-30 23:59:59",
            "Wirksam bis": "2017-03-31 23:59:00"
        }
    ]
};