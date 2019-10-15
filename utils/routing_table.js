/* eslint-disable strict, object-curly-newline */

'use strict';

const rules = [
    { path: '^/token/?', roles: [], method: 'POST', db_method: 'f_insert_token', call_type: 'SELECT' },

    { path: '^/user/\\d+/pass', roles: [], method: 'PUT', db_method: 'f_set_user_pass', call_type: 'SELECT' },
    { path: '^/user/types', roles: [], method: 'GET', db_method: 'f_get_user_types', call_type: 'SELECT' },
    { path: '^/user/roles', roles: [], method: 'GET', db_method: 'f_get_user_roles', call_type: 'SELECT' },
    { path: '^/user/login', roles: [], method: 'POST', db_method: 'f_login_user', call_type: 'SELECT' },
    { path: '^/user/\\d+', roles: [], method: 'GET', db_method: 'f_get_users', call_type: 'SELECT' },
    { path: '^/user/\\d+', roles: [], method: 'PUT', db_method: 'p_update_user', call_type: 'CALL' },
    { path: '^/user/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_user', call_type: 'CALL' },
    { path: '^/user/?', roles: [], method: 'POST', db_method: 'f_register_user', call_type: 'SELECT' },
    { path: '^/user/?', roles: [], method: 'GET', db_method: 'f_get_users', call_type: 'SELECT' },

    { path: '^/group/\\d+/student/\\d+', roles: [], method: 'PUT', db_method: 'p_add_stud_group', call_type: 'CALL' },
    { path: '^/group/\\d+/student/\\d+', roles: [], method: 'DELETE', db_method: 'p_rem_stud_group', call_type: 'CALL' },
    { path: '^/group/\\d+/student/?', roles: [], method: 'GET', db_method: 'f_get_stud_group', call_type: 'SELECT' },
    { path: '^/group/\\d+', roles: [], method: 'PUT', db_method: 'p_update_group', call_type: 'CALL' },
    { path: '^/group/\\d+', roles: [], method: 'GET', db_method: 'f_get_group', call_type: 'SELECT' },
    { path: '^/group/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_group', call_type: 'CALL' },
    { path: '^/group/?', roles: [], method: 'GET', db_method: 'f_get_group', call_type: 'SELECT' },
    { path: '^/group/?', roles: [], method: 'POST', db_method: 'f_add_group', call_type: 'SELECT' },

    { path: '^/game/\\d+', roles: [], method: 'PUT', db_method: 'p_update_game', call_type: 'CALL' },
    { path: '^/game/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_game', call_type: 'CALL' },
    { path: '^/game/\\d+', roles: [], method: 'GET', db_method: 'f_get_games', call_type: 'SELECT' },
    { path: '^/game/?', roles: [], method: 'GET', db_method: 'f_get_games', call_type: 'SELECT' },
    { path: '^/game/?', roles: [], method: 'POST', db_method: 'p_add_game', call_type: 'CALL' },

    { path: '^/club/\\d+', roles: [], method: 'PUT', db_method: 'p_update_club', call_type: 'CALL' },
    { path: '^/club/\\d+', roles: [], method: 'DELETE', db_method: 'jjj', call_type: 'CALL' },
    { path: '^/club/?', roles: [], method: 'GET', db_method: 'f_get_clubs', call_type: 'SELECT' },
    { path: '^/club/?', roles: [], method: 'POST', db_method: 'p_add_club', call_type: 'CALL' },

    { path: '^/news/\\d+', roles: [], method: 'PUT', db_method: 'p_update_news', call_type: 'CALL' },
    { path: '^/news/\\d+', roles: [], method: 'DELETE', db_method: 'jjj', call_type: 'CALL' },
    { path: '^/news/?', roles: [], method: 'GET', db_method: 'f_get_news', call_type: 'SELECT' },
    { path: '^/news/?', roles: [], method: 'POST', db_method: 'p_add_news', call_type: 'CALL' },

    { path: '^/event/\\d+', roles: [], method: 'PUT', db_method: 'p_update_event', call_type: 'CALL' },
    { path: '^/event/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_event', call_type: 'CALL' },
    { path: '^/event/?', roles: [], method: 'GET', db_method: 'f_get_events', call_type: 'SELECT' },
    { path: '^/event/?', roles: [], method: 'POST', db_method: 'p_add_event', call_type: 'CALL' },

    { path: '^/order/\\d+', roles: [], method: 'PUT', db_method: 'f_update_order', call_type: 'SELECT' },
    // { path: '^/payment/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_event', call_type: 'CALL' },
    { path: '^/order/?', roles: [], method: 'GET', db_method: 'f_get_next_order', call_type: 'SELECT' },
    // { path: '^/order/?', roles: [], method: 'POST', db_method: 'p_add_event', call_type: 'CALL' },

    { path: '^/trainer/\\d+', roles: [], method: 'PUT', db_method: 'p_update_trainer', call_type: 'CALL' },
    { path: '^/trainer/\\d+', roles: [], method: 'DELETE', db_method: 'p_delete_trainer', call_type: 'CALL' },
    { path: '^/trainer/\\d+', roles: [], method: 'GET', db_method: 'f_get_trainer', call_type: 'SELECT' },
    { path: '^/trainer/?', roles: [], method: 'GET', db_method: 'f_get_trainers', call_type: 'SELECT' },
    { path: '^/trainer/?', roles: [], method: 'POST', db_method: 'p_add_trainer', call_type: 'CALL' },

    { path: '^/token/?', roles: [], method: 'POST', db_method: 'f_insert_token', call_type: 'SELECT' },
];

// eslint-disable-next-line no-return-assign, no-param-reassign
rules.forEach((rule) => (rule.path = new RegExp(rule.path)));

module.exports.rules = rules;

const routes = [
    { route: 'updateOrder', db_method: 'f_update_order', call_type: 'SELECT' },
    { route: 'getNextOrder', db_method: 'f_get_next_order', call_type: 'SELECT' },
];

module.exports.routes = routes;
