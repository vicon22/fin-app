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

  INSERT INTO income_categories (title, description) VALUES ('Salary', 'Regular income like salary or binuses');
  INSERT INTO income_categories (title, description) VALUES ('Transfer', 'Transaction from another project');
  INSERT INTO income_categories (title, description) VALUES ('Gift', 'Gifts and presents');
  
  INSERT INTO expense_categories (title, description) VALUES ('Shopping', 'Store food and drinks expenses');
  INSERT INTO expense_categories (title, description) VALUES ('Journeys', 'Travel and trips');
  INSERT INTO expense_categories (title, description) VALUES ('Entertainment', 'Amusement and hobby costs');
  INSERT INTO expense_categories (title, description) VALUES ('Education', 'Tuition fees and courses costs');
  INSERT INTO expense_categories (title, description) VALUES ('Other', 'Misc costs category');

  INSERT INTO projects (name, user_id, currency_id) values('Exchange', (select id from users where username = 'richmen'), (select id from currencies where value = 'RUB'));
  INSERT INTO projects (name, user_id, currency_id) values('Incomes', (select id from users where username = 'richmen'), (select id from currencies where value = 'USD'));
  INSERT INTO projects (name, user_id, currency_id) values('Spendings', (select id from users where username = 'richmen'), (select id from currencies where value = 'EUR'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (10000000, 'Salary for last month', (select id from projects where name = 'Exchange'), (select id from income_categories where title = 'Salary'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (5000000, 'Stocks income', (select id from projects where name = 'Exchange'), (select id from income_categories where title = 'Salary'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (200000000, 'Annual bonus', (select id from projects where name = 'Exchange'), (select id from income_categories where title = 'Salary'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (100000000, 'Transfer from export account', (select id from projects where name = 'Incomes'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (250000000, 'Oil export transfer', (select id from projects where name = 'Incomes'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (500000000, 'Diamonds income transfer', (select id from projects where name = 'Incomes'), (select id from income_categories where title = 'Transfer'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (2000000, 'Transfer for day-to-day spents', (select id from projects where name = 'Spendings'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (2500000, 'Transfer for jet rental', (select id from projects where name = 'Spendings'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (5000000, 'Transfer for pizza in Rome', (select id from projects where name = 'Spendings'), (select id from income_categories where title = 'Transfer'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (10000000, 'MBA payment', (select id from projects where name = 'Exchange'), (select id from expense_categories where title = 'Education'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (5000000, 'Python course', (select id from projects where name = 'Exchange'), (select id from expense_categories where title = 'Education'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (10000000, 'Visit to Rome', (select id from projects where name = 'Incomes'), (select id from expense_categories where title = 'Journeys'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (12000000, 'Visit to US', (select id from projects where name = 'Incomes'), (select id from expense_categories where title = 'Journeys'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (21000000, 'Visit to Voronej', (select id from projects where name = 'Incomes'), (select id from expense_categories where title = 'Journeys'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (100000, 'Kroshka-kortoshka', (select id from projects where name = 'Spendings'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (120000, 'Civiar', (select id from projects where name = 'Spendings'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (130000, 'Fuagra', (select id from projects where name = 'Spendings'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (230000, 'Wildberries', (select id from projects where name = 'Spendings'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (220000, 'Ozon', (select id from projects where name = 'Spendings'), (select id from expense_categories where title = 'Shopping'));

  INSERT INTO projects (name, user_id, currency_id) values('Rubble', (select id from users where username = 'reveler'), (select id from currencies where value = 'RUB'));
  INSERT INTO projects (name, user_id, currency_id) values('Dollars', (select id from users where username = 'reveler'), (select id from currencies where value = 'USD'));
  INSERT INTO projects (name, user_id, currency_id) values('Euro', (select id from users where username = 'reveler'), (select id from currencies where value = 'EUR'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (1000000, 'Salary for last month', (select id from projects where name = 'Rubble'), (select id from income_categories where title = 'Salary'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (500000, 'Sashka return debt', (select id from projects where name = 'Rubble'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (20000000, 'Found in the club', (select id from projects where name = 'Rubble'), (select id from income_categories where title = 'Transfer'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (100000, 'Gift from grandma', (select id from projects where name = 'Dollars'), (select id from income_categories where title = 'Gift'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (500000, 'Won pizza-eating competition', (select id from projects where name = 'Dollars'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (2000000, 'Gift from grandpa', (select id from projects where name = 'Dollars'), (select id from income_categories where title = 'Gift'));

  INSERT INTO incomes (amount, title, project_id, category_id) values (100000, 'Last sallary from Microsoft', (select id from projects where name = 'Euro'), (select id from income_categories where title = 'Salary'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (150000, 'Casino wins', (select id from projects where name = 'Euro'), (select id from income_categories where title = 'Transfer'));
  INSERT INTO incomes (amount, title, project_id, category_id) values (120000, 'Mom transfer', (select id from projects where name = 'Euro'), (select id from income_categories where title = 'Gift'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (10000, 'Newspaper', (select id from projects where name = 'Rubble'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (12000, 'Watter and cookies', (select id from projects where name = 'Rubble'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (13000, 'Shaurma on Savelovskay station', (select id from projects where name = 'Rubble'), (select id from expense_categories where title = 'Other'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (230000, 'Pyaterochka', (select id from projects where name = 'Rubble'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (120000, 'Krasnoe-and-beloye', (select id from projects where name = 'Rubble'), (select id from expense_categories where title = 'Shopping'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (20000, 'Disco', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Entertainment'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (120000, 'Night clud', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Entertainment'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (630000, 'Bar', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Entertainment'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (3300000, 'Hot night', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Entertainment'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (9200000, 'Visit to Piter', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Entertainment'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (130000, 'TV', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (3300000, 'Mustang GT', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (520000, 'Turbo jet pack', (select id from projects where name = 'Dollars'), (select id from expense_categories where title = 'Shopping'));

  INSERT INTO expenses (amount, title, project_id, category_id) values (33000, 'PS 5', (select id from projects where name = 'Euro'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (42000, 'iPhone Pro 23 max', (select id from projects where name = 'Euro'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (65000, 'MacBook pro 15', (select id from projects where name = 'Euro'), (select id from expense_categories where title = 'Shopping'));
  INSERT INTO expenses (amount, title, project_id, category_id) values (23000, 'Tesla subscription', (select id from projects where name = 'Euro'), (select id from expense_categories where title = 'Shopping'));
EOF
