'use strict';

var bodyEncoders = require('asker').bodyEncoders;
var hasProperty = Object.prototype.hasOwnProperty;
var vowAsker = require('vow-asker');
var url = require('fast-url-parser');
var _ = require('lodash-node');

module.exports = function (app) {
    app.install('fist-fistlabs_unit_serial');

    /**
     * @class _fistlabs_unit_asker
     * @extends _fistlabs_unit_serial
     * */
    app.unit({

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @property
         * @type {String}
         * */
        base: '_fistlabs_unit_serial',

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @property
         * @type {String}
         * */
        name: '_fistlabs_unit_asker',

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @property
         * @type {Array<String>}
         * */
        series: [
            'options',
            'prepare',
            'request',
            'compile',
            'resolve'
        ],

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @method
         *
         * @param {Object} track
         * @param {Object} context
         *
         * @returns {*}
         * */
        options: function (track, context) {
            /*eslint no-unused-vars: 0*/
            return {};
        },

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @method
         *
         * @param {Object} track
         * @param {Object} context
         *
         * @returns {*}
         * */
        prepare: function (track, context) {
            var opts = Object(context.prev);
            var path = opts.path;

            if (path && typeof path.build === 'function') {
                opts.path = path.build(opts.vars);
            }

            if (opts.path && opts.query) {
                //  fix asker bug in 0.11.15
                path = url.parse(opts.path, true);
                opts.path = url.format({
                    pathname: path.pathname,
                    query: _.extend({}, path.query, opts.query)
                });
                delete opts.query;
            }

            return opts;
        },

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @method
         *
         * @param {Object} track
         * @param {Object} context
         *
         * @returns {*}
         * */
        request: function (track, context) {
            var opts = context.prev;

            track.logger.info('Outgoing %s %s%s%s', function () {
                return opts.method || 'GET';
            }, function () {
                var parsedPath = url.parse(opts.path, true);
                var parsedHost;

                // in http options hostname preferred over host
                if (!opts.hostname) {
                    parsedHost = url.parse('//' + (opts.host || 'localhost'), true, true);
                }

                return url.format({
                    protocol: opts.protocol || 'http:',
                    hostname: parsedHost ? parsedHost.hostname : opts.hostname,
                    port: parsedHost ? parsedHost.port : opts.port,
                    pathname: parsedPath.pathname,
                    query: parsedPath.query
                });
            }, function () {
                var header = '';
                var name;

                for (name in opts.headers) {
                    if (hasProperty.call(opts.headers, name)) {
                        header += '\n\t' + name + ': ' + opts.headers[name];
                    }
                }

                return header;
            }, function () {
                if (opts.body) {
                    if (!opts.bodyEncoding) {
                        opts.bodyEncoding = 'string';
                    }

                    if (bodyEncoders.hasOwnProperty(opts.bodyEncoding)) {
                        return '\n' + bodyEncoders[opts.bodyEncoding](opts.body, function () {});
                    }
                }

                return '';
            });

            return vowAsker(opts);
        },

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @method
         *
         * @param {Object} track
         * @param {Object} context
         *
         * @returns {*}
         * */
        compile: function (track, context) {
            context.prev.data = JSON.parse(context.prev.data);
            return context.prev;
        },

        /**
         * @public
         * @memberOf {_fistlabs_unit_asker}
         * @method
         *
         * @param {Object} track
         * @param {Object} context
         *
         * @returns {*}
         * */
        resolve: function (track, context) {
            return context.prev.data;
        }

    });

};
