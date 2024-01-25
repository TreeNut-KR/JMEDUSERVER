FROM mysql/mysql-server:5.7

COPY ./init.sql /docker-entrypoint-initdb.d/

CMD [ "mysqld" ]

# SOURCE var/lib/mysql/first_setting.sql