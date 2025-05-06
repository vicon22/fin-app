#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOF
 INSERT INTO currencies (value) VALUES ('RUB');
 INSERT INTO currencies (value) VALUES ('USD');
 INSERT INTO currencies (value) VALUES ('EUR');

 WITH normal_user_id AS (
  INSERT INTO users (name, username, password) values ('Johnny Star', 'reveler', '\$2a\$10\$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe') RETURNING id
 ) INSERT INTO user_roles (user_id, roles) VALUES ((select id from normal_user_id), 'USER');

 WITH admin_user_id AS (
  INSERT INTO users (name, username, password) values ('Richy Rich', 'richmen', '\$2a\$10\$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe') RETURNING id
 ) INSERT INTO user_roles (user_id, roles) VALUES ((select id from admin_user_id), 'USER');

 INSERT INTO banks (name, reg, ogrn) values ('ПАО АКБ "1Банк"', 2896, 1021500000147);
 INSERT INTO banks (name, reg, ogrn) values ('АКБ "Абсолют Банк" (ПАО)', 2306, 1027700024560);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО АКБ "АВАНГАРД"', 2879, 1027700367507);
 INSERT INTO banks (name, reg, ogrn) values ('АО Банк "Аверс"', 415, 1231600067654);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Авто Финанс Банк"', 170, 1025500003737);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Автоградбанк"', 1455, 1021600000806);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "АвтоКредитБанк"', 1973, 1021600000366);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "АТБ" Банк', 2776, 1027739408290);
 INSERT INTO banks (name, reg, ogrn) values ('БАНК "АГОРА" ООО', 3231, 1027700156164);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО АГРОИНКОМБАНК', 1946, 1023000927520);
 INSERT INTO banks (name, reg, ogrn) values ('Азия-Инвест Банк (АО)', 3303, 1027739278973);
 INSERT INTO banks (name, reg, ogrn) values ('РНКО АЗИЯПЭЙ ООО', 3544, 1227700549780);
 INSERT INTO banks (name, reg, ogrn) values ('ООО КБ "АйМаниБанк"', 1975, 1020400000081);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "АК БАРС" БАНК', 2590, 1021600000124);
 INSERT INTO banks (name, reg, ogrn) values ('АО "АЛЬФА-БАНК"', 1326, 1027700067328);
 INSERT INTO banks (name, reg, ogrn) values ('"АМБ Банк" (ПАО)', 3036, 1027700034372);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Америкэн Экспресс Банк', 3460, 1057711014800);
 INSERT INTO banks (name, reg, ogrn) values ('ООО РНКО "АМРА"', 3554, 1257700145614);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "АМТ БАНК"', 2820, 1027700182366);
 INSERT INTO banks (name, reg, ogrn) values ('АО КБ "Ассоциация"', 732, 1025200000352);
 INSERT INTO banks (name, reg, ogrn) values ('ОАО "АФ Банк"', 991	, 020280000014);
 INSERT INTO banks (name, reg, ogrn) values ('БайкалБанк (ПАО)', 2632, 1020300003460);
 INSERT INTO banks (name, reg, ogrn) values ('АО "БАЛАКОВО-БАНК"', 444, 1026400002265);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО АКБ "Балтика"', 967, 1023900001993);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "БАЛТИНВЕСТБАНК"', 3176, 1027800001570);
 INSERT INTO banks (name, reg, ogrn) values ('Банк - Т (ОАО)', 625, 1062300007901);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "Банк "Санкт-Петербург"', 436, 1027800000140);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Банк 131"', 3538, 1241600056390);
 INSERT INTO banks (name, reg, ogrn) values ('АО "БАНК БЕРЕЙТ"', 3505, 1124700000160);
 INSERT INTO banks (name, reg, ogrn) values ('ООО КБ "Банк БФТ"', 2273, 1027739564786);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Банк РСИ"', 3415, 1027739312589);
 INSERT INTO banks (name, reg, ogrn) values ('ЗАО "С банк"', 2581, 1037739299685);
 INSERT INTO banks (name, reg, ogrn) values ('АО "БАНК СГБ"', 2816, 1023500000160);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Банк ФИНАМ"', 2799, 1037739001046);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "БАНК ФИНИНВЕСТ"', 671, 1026400002310);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Банк ЧБРР"', 3527, 1149102030186);
 INSERT INTO banks (name, reg, ogrn) values ('"БСТ-БАНК" АО', 2883, 1024200002276);
 INSERT INTO banks (name, reg, ogrn) values ('АО "БКС Банк"', 101, 1055400000369);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Бланк банк"', 2368, 1026000001796);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "БыстроБанк"', 1745, 1021800001508);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Вайлдберриз Банк"', 841, 1020100002340);
 INSERT INTO banks (name, reg, ogrn) values ('АО КБ "ВАКОБАНК"', 1291, 1026000002160);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО Банк "ВВБ"', 1093, 1027600000020);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Внешпромбанк"', 3261, 1027700514049);
 INSERT INTO banks (name, reg, ogrn) values ('ОАО "ВКБ"', 1153, 1026300001815);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Вологдабанк"', 992, 1023500000040);
 INSERT INTO banks (name, reg, ogrn) values ('АО "ЕвроАксис Банк"', 3273, 1037739162779);
 INSERT INTO banks (name, reg, ogrn) values ('АО КИБ "ЕВРОАЛЬЯНС"', 1781, 1023700001467);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО КБ "ЕвроситиБанк"', 1869, 1022600000059);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Заубер Банк"', 1614, 1020900001781);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "ЗЕМКОМБАНК"', 574, 1026100001982);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Земский банк"', 2900, 1156300000141);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Зернобанк"', 2337, 1022200525786);
 INSERT INTO banks (name, reg, ogrn) values ('АО КБ "Златкомбанк"', 568, 1027400000154);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "ИДЕЯ Банк"', 430, 1022300000447);
 INSERT INTO banks (name, reg, ogrn) values ('ООО "Инбанк"', 1829, 1025600001668);
 INSERT INTO banks (name, reg, ogrn) values ('ООО КБ "Инстройбанк"', 2743, 1027739860554);
 INSERT INTO banks (name, reg, ogrn) values ('Банк ИПБ (АО)', 600, 1027739065375);
 INSERT INTO banks (name, reg, ogrn) values ('АО АБ "Капитал"', 575, 1028600002199);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Кранбанк"', 2271, 1023700007407);
 INSERT INTO banks (name, reg, ogrn) values ('ОАО КБ "Максимум"', 466, 1026100002180);
 INSERT INTO banks (name, reg, ogrn) values ('ОАО КБ "МАСТ-Банк"', 3267, 1027739199124);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "МТС-Банк"', 2268, 1027739053704);
 INSERT INTO banks (name, reg, ogrn) values ('АО "ОТП Банк"', 2766, 1027739176563);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "ОФК Банк"', 2270, 1027739495420);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Промэнергобанк"', 2728, 1023500000028);
 INSERT INTO banks (name, reg, ogrn) values ('АО "ПроБанк"', 3296, 1037739447350);
 INSERT INTO banks (name, reg, ogrn) values ('ПАО "Татфондбанк"', 3058, 1021600000036);
 INSERT INTO banks (name, reg, ogrn) values ('АО "ТБанк"', 2673, 1027739642281);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Тимер Банк"', 1581, 1021600000146);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Тойота Банк"', 3470, 1077711000058);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Ури Банк"', 3479, 1077711000190);
 INSERT INTO banks (name, reg, ogrn) values ('АО "ФИА-БАНК"', 2542, 1026300001980);
 INSERT INTO banks (name, reg, ogrn) values ('ЭКСИ-Банк (АО)', 2530, 1027800000942);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Эксперт Банк"', 2949, 1025500001328);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Экспобанк"', 2998, 1217700369083);
 INSERT INTO banks (name, reg, ogrn) values ('АО КБ "ЮНИСТРИМ"', 3467, 1067711004437);
 INSERT INTO banks (name, reg, ogrn) values ('АО "Яндекс Банк"', 3027, 1077711000091);

 INSERT INTO transaction_categories (title, description) VALUES ('Расчеты с подрядчиками', 'Счета и расчеты с поставщиками и подрядчиками');
 INSERT INTO transaction_categories (title, description) VALUES ('Взаиморасчеты', 'Внутренние расчеты с организациями');
 INSERT INTO transaction_categories (title, description) VALUES ('Внутренние переводы', 'Перевроды между дочерними организациями');
 INSERT INTO transaction_categories (title, description) VALUES ('Основные средства', 'Взносы и амортизация основных средств');
 INSERT INTO transaction_categories (title, description) VALUES ('Контрагенты', 'Фонд оплат и взносов');

 INSERT INTO projects (name, user_id, currency_id) values('Exchange', (select id from users where username = 'richmen'), (select id from currencies where value = 'RUB'));
 INSERT INTO projects (name, user_id, currency_id) values('Incomes', (select id from users where username = 'richmen'), (select id from currencies where value = 'USD'));
 INSERT INTO projects (name, user_id, currency_id) values('SPENDINGs', (select id from users where username = 'richmen'), (select id from currencies where value = 'EUR'));
 INSERT INTO projects (name, user_id, currency_id) values('Rubble', (select id from users where username = 'reveler'), (select id from currencies where value = 'RUB'));
 INSERT INTO projects (name, user_id, currency_id) values('Dollars', (select id from users where username = 'reveler'), (select id from currencies where value = 'USD'));
 INSERT INTO projects (name, user_id, currency_id) values('Euro', (select id from users where username = 'reveler'), (select id from currencies where value = 'EUR'));

 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '15 day', 520000, 'Оплата счета №12765', 'Перевод в ромашку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Dollars'), (select id from transaction_categories where title = 'Расчеты с подрядчиками'), (select id from banks where reg = 3544), (select id from banks where reg = 2270), '40702810270776386914', '40702810457643636361', '616861018103', '70267267090');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '10 day', 10000, 'Оплата счета №4265', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Dollars'), (select id from transaction_categories where title = 'Расчеты с подрядчиками'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810463876023515', '40702810162466556803', '538421366985', '77797749277');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '10 day', 120300, 'Оплата счета №4265', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Dollars'), (select id from transaction_categories where title = 'Расчеты с подрядчиками'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810483533148784', '40702810538973759232', '325358783198', '70716527756');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '10 day', 124000, 'Оплата счета №33665', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Dollars'), (select id from transaction_categories where title = 'Взаиморасчеты'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810218816997335', '40702810526951240341', '616861018103', '78556359828');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '4 day', 120000, 'Оплата счета №6665', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Dollars'), (select id from transaction_categories where title = 'Расчеты с подрядчиками'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810247065788473', '40702810697858632745', '882405361900', '76800162028');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '4 day', 12000, 'Оплата счета №6665', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Основные средства'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810723731262342', '40702810665911027436', '683175204671', '76736071969');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '2 day', 50000, 'Оплата счета №65', 'Перевод васильку', 'APPROVED', 'LEGAL', 'INCOME', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 1614), (select id from banks where reg = 2270), '40702810951005011596', '40702810217212980769', '589157094093', '73948974559'); 
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '2 day', 12000, 'Оплата кривого счета №65', 'Платеж может вернуться', 'RETURNED', 'PHYSICAL', 'EXPENSE', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 1326), (select id from banks where reg = 3036), '40702810951005011596', '40702810217212980769', '589157094093', '73948974559'); 
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '20 day', 12000, 'Оплата старого счета №5', 'Канцелярка', 'FULFILLED', 'PHYSICAL', 'EXPENSE', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 1326), (select id from banks where reg = 3036), '40702810365771199092', '40702810668515143794', '016689259514', '78985711973');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '20 day', 12000, 'Оплата счета №1', 'Аналитика', 'CANCELED', 'PHYSICAL', 'EXPENSE', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 3505), (select id from banks where reg = 2273), '40702810365771199092', '40702810668515143794', '016689259514', '78985711973'); 
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '22 day', 12000, 'Оплата счета №1', 'Поставки', 'DELETED', 'PHYSICAL', 'EXPENSE', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 3505), (select id from banks where reg = 2273), '40702810365771199092', '40702810668515143794', '314752180707', '76337827355');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '20 day', 12000, 'Оплата счета №1', 'Аналитика', 'CANCELED', 'PHYSICAL', 'EXPENSE', (select id from projects where name = 'Euro'), (select id from transaction_categories where title = 'Внутренние переводы'), (select id from banks where reg = 3505), (select id from banks where reg = 2273), '40702810365771199092', '40702810668515143794', '016689259514', '78985711973');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '1 day', 22000, 'Взносы', 'Оборудование', 'PENDING', 'LEGAL', 'EXPENSE', (select id from projects where name = 'Rubble'), (select id from transaction_categories where title = 'Основные средства'), (select id from banks where reg = 1614), (select id from banks where reg = 574), '40702810242030284253', '40702810782170980249', '581204324641', '76028163779');
 INSERT INTO transactions (created, amount, title, details, state, legal_type, flow_type, project_id, category_id, producer_bank_id, consumer_bank_id, producer_account, consumer_account, consumer_tin, consumer_tel) values (now() - interval '1 day', 2000, 'Амортизация', 'Оборудование', 'PENDING', 'LEGAL', 'EXPENSE', (select id from projects where name = 'Rubble'), (select id from transaction_categories where title = 'Основные средства'), (select id from banks where reg = 625), (select id from banks where reg = 436), '40702810983963784875', '40702810089924911549', '780476151290', '70267267090');
EOF
