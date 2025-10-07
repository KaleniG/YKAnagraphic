<?php

namespace App\Controllers;

use App\Core\Log;
use App\Core\Path;
use App\Models\Anagraphic;
use App\Models\AnagraphicManager;

class AnagraphicController
{
  private $anagraphics = null;

  public function handleRequests()
  {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $operation = $_POST["operation"] ?? null;

      switch ($operation) {
        case "add":
          $this->handleOperationAdd();
          break;
        case "remove":
          $this->handleOperationRemove();
          break;
        case "update":
          $this->handleOperationUpdate();
          break;
      }

      exit;
    }

    $manager = new AnagraphicManager();
    $this->anagraphics = $manager->getAllAnagraphics();

    include Path::views("Anagraphics.php");
  }

  private function handleOperationAdd()
  {
    $anagraphic = new Anagraphic();
    $anagraphic->name = $_POST["name"] ?? null;
    $anagraphic->surname = $_POST["surname"] ?? null;
    $anagraphic->city_name = $_POST["city_name"] ?? null;
    $anagraphic->way_name = $_POST["way_name"] ?? null;
    $anagraphic->way_number = $_POST["way_number"] ?? null;
    $anagraphic->email = $_POST["email"] ?? null;
    $anagraphic->phone_number = $_POST["phone_number"] ?? null;
    $anagraphic->enabled = !empty($_POST["enabled"]);

    if (!$anagraphic->validateAdd()) {

      echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
      ]);
      return;
    }

    $manager = new AnagraphicManager();
    $id = $manager->add($anagraphic);

    header("Content-Type: application/json");
    echo json_encode([
      "status" => "ok",
      "id" => $id
    ]);
  }


  private function handleOperationRemove()
  {
    $anagraphic = new Anagraphic();
    $anagraphic->id = $_POST["id"] ?? null;
    $anagraphic->enabled = !empty($_POST["enabled"]);
    if (!$anagraphic->validateRemove()) {
      header("Content-Type: application/json");
      echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
      ]);
      return;
    }

    $manager = new AnagraphicManager();
    $manager->remove($anagraphic);

    header("Content-Type: application/json");
    echo json_encode([
      "status" => "ok"
    ]);
  }

  private function handleOperationUpdate()
  {
    $anagraphic = new Anagraphic();
    $anagraphic->id = $_POST["id"] ?? null;
    $anagraphic->name = $_POST["name"] ?? null;
    $anagraphic->surname = $_POST["surname"] ?? null;
    $anagraphic->city_name = $_POST["city_name"] ?? null;
    $anagraphic->way_name = $_POST["way_name"] ?? null;
    $anagraphic->way_number = $_POST["way_number"] ?? null;

    if (!$anagraphic->validateUpdate()) {
      header("Content-Type: application/json");
      echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
      ]);
      return;
    }

    $anagraphic->email = $_POST["email"] ?? null;
    $anagraphic->phone_number = $_POST["phone_number"] ?? null;
    $anagraphic->enabled = !empty($_POST["enabled"]);

    $manager = new AnagraphicManager();
    $manager->update($anagraphic);

    header("Content-Type: application/json");
    echo json_encode([
      "status" => "ok"
    ]);
  }
}
