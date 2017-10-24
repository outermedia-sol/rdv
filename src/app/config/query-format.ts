export class QueryFormat {
    searchFields = {
        "search1": {
            "field": "all_text",
            "value": ""
        },
        "search2": {
            "field": "ti_all_text",
            "value": ""
        },
        "search3": {
            "field": "person_all_text",
            "value": ""
        }
    };

    facetFields = {};

    filterFields = {
        "institution": {
            "field": "mode_all_facet",
            "values": []
        }
    }

    rangeFields = {
        "year": {
            "field": "py_int",
            "min": 1950,
            "from": 1950,
            "to": 2017,
            "max": 2017,
            "showMissingValues": true
        }
    };

    queryParams = {
        "rows": 10,
        "start": 0,
        "sortField": "id_int",
        "sortDir": "asc"
    };

    constructor() { }
}