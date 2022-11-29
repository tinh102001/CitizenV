const sign = require('./sign.route');
const list = require('./list.route');
const manage = require('./manage.route');
const search = require('./search.route');
const form = require('./form.route');


function route(app) {
    app.use('/list', list);
    app.use('/manage', manage);
    app.use('/search', search);
    app.use('/form', form);
    app.use('/', sign);
}

module.exports = route;