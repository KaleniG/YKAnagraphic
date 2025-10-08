<?php

namespace App\Core;

class AssetManager
{
  private $css = [
    "assets/css/style.css"
  ];

  private $js = [
    "https://code.jquery.com/jquery-3.5.1.min.js"
  ];

  public function importCSS()
  {
    $allfiles = "";
    $randMario = mt_rand(1, 11000);
    foreach ($this->css as $css_file)
      $allfiles .= "<link rel='stylesheet' href='{$css_file}?randMario={$randMario}'>";
    return $allfiles;
  }

  public function importJS()
  {
    $allfiles = "";
    foreach ($this->js as $js_file)
      $allfiles .= "<script src='{$js_file}'></script>";
    return $allfiles;
  }
}
