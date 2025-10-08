<?php

namespace App\Models;

use App\Core\Log;
use App\Core\Model;

class AnagraphicManager extends Model
{
  private static $prepared = false;

  public function prepareAll()
  {
    if (AnagraphicManager::$prepared) return;

    pg_prepare(
      Model::getConn(),
      "anagraphic_get_all",
      "SELECT * FROM anagraphics ORDER BY id"
    );

    pg_prepare(
      Model::getConn(),
      "anagraphic_add",
      "INSERT INTO anagraphics (name, surname, email, phone_number, city_name, way_name, way_number, enabled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id"
    );

    pg_prepare(
      Model::getConn(),
      "anagraphic_remove",
      "DELETE FROM anagraphics WHERE id=$1"
    );

    pg_prepare(
      Model::getConn(),
      "anagraphic_update",
      "UPDATE anagraphics SET name=$1, surname=$2, email=$3, phone_number=$4, city_name=$5, way_name=$6, way_number=$7, enabled=$8 WHERE id=$9"
    );

    AnagraphicManager::$prepared = true;
  }

  public function getAllAnagraphics()
  {
    $this->prepareAll();

    $result = pg_execute(
      Model::getConn(),
      "anagraphic_get_all",
      []
    );

    if (!$result) Log::error("Query failed: " . Model::getError());

    $anagraphics = pg_fetch_all($result);


    foreach ($anagraphics as $anagraphic) {
      $anagraphic["enabled"] = ($anagraphic["enabled"] === "t") ? true : false;
    }

    return $anagraphics;
  }

  public function add(Anagraphic $anagraphic): int
  {
    $this->prepareAll();

    $result = pg_execute(
      Model::getConn(),
      "anagraphic_add",
      [
        $anagraphic->name,
        $anagraphic->surname,
        $anagraphic->email ?? "",
        $anagraphic->phone_number ?? "",
        $anagraphic->city_name,
        $anagraphic->way_name,
        $anagraphic->way_number,
        $anagraphic->enabled ? "t" : "f"
      ]
    );

    if (!$result) Log::error("Query failed: " . Model::getError());

    return pg_fetch_result($result, 0);
  }

  public function remove(Anagraphic $anagraphic)
  {
    $this->prepareAll();

    $result = pg_execute(
      Model::getConn(),
      "anagraphic_remove",
      [$anagraphic->id]
    );

    if (!$result) Log::error("Query failed: " . Model::getError());
  }

  public function update(Anagraphic $anagraphic)
  {
    $this->prepareAll();

    Log::info(var_export($anagraphic, true));

    $result = pg_execute(
      Model::getConn(),
      "anagraphic_update",
      [
        $anagraphic->name,
        $anagraphic->surname,
        $anagraphic->email ?? "",
        $anagraphic->phone_number ?? "",
        $anagraphic->city_name,
        $anagraphic->way_name,
        $anagraphic->way_number,
        $anagraphic->enabled ? "t" : "f",
        $anagraphic->id
      ]
    );

    if (!$result) Log::error("Query failed: " . Model::getError());

    return pg_fetch_result($result, 0);
  }
}
