<?php

namespace App\Core;

abstract class Model
{
  private static $db_conn = null;

  private static function initDB()
  {
    if (isset(self::$db_conn)) {
      Log::error("Database connection already initialized");
      return;
    } else {
      $conn_string = "host=localhost dbname=ykanagraphic user=postgres password=Gr-dx23Fdg";
      self::$db_conn = pg_connect($conn_string);

      if (!self::$db_conn) {
        self::$db_conn = null;
        Log::error("Failed to initialize the database connection: " . pg_last_error());
        return;
      }
    }
  }

  protected static function getConn()
  {
    if (!isset(self::$db_conn))
      self::initDB();

    return self::$db_conn;
  }

  protected static function getError()
  {
    return pg_last_error(self::getConn());
  }

  abstract public function prepareAll();
}
