/**
 * Created by Preston on 2018/9/9.
 */
//connect elasticsearch
var elasticsearch = require('elasticsearch');
var es = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

module.exports = es;