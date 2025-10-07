<?php

namespace App\Core;

require_once Path::autoloader();

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\LineFormatter;

class Log
{
  private static ?Logger $logger = null;

  private static function getLogger()
  {
    if (self::$logger === null) {
      $sessionId = session_id();
      if (empty($sessionId)) {
        $sessionId = "no-session";
      }
      $logFile = __DIR__ . "/../../runtime/app_session_{$sessionId}.log";

      $handler = new StreamHandler($logFile, Level::Debug);

      $output = "[%datetime%] %channel%.%level_name%: %message%\n";
      $dateFormat = "Y-m-d H:i:s";
      $formatter = new LineFormatter($output, $dateFormat, true, true);
      $handler->setFormatter($formatter);

      self::$logger = new Logger("ykschool");
      self::$logger->pushHandler($handler);
    }

    return self::$logger;
  }

  public static function error($string)
  {
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
    $callerFile = $backtrace[1]["file"] ?? "unknown file";
    $callerLine = $backtrace[1]["line"] ?? "unknown file";
    self::getLogger()->error("[$callerFile] [$callerLine] " . $string);
    header("Location: runtime/");
    exit;
  }

  public static function info($string)
  {
    self::getLogger()->info($string);
  }
}
