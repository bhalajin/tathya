//object for Mysql connection

exports.dbconfig = {
    host : 'localhost',
    user: '[user_name]',
    password: '[password]',
    database: '[database_name]',
};

//object for solr connection

//setting solr properties
exports.solr_config = {
    core : "[solr_core_name]",
    host : "localhost",
    port : 8983
};


//object for server connection
exports.server_config = {
    port : 3000,
    host : "localhost"    

};