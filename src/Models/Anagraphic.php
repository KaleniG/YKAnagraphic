<?php

namespace App\Models;

class Anagraphic
{
  public ?int $id = null;
  public ?string $name = null;
  public ?string $surname = null;
  public ?string $email = null;
  public ?string $phone_number = null;
  public ?string $city_name = null;
  public ?string $way_name = null;
  public ?string $way_number = null;
  public ?bool $enabled = null;

  public function validateAdd(): bool
  {
    return (
      !empty($this->name) &&
      !empty($this->surname) &&
      !empty($this->city_name) &&
      !empty($this->way_name) &&
      !empty($this->way_number)
    );
  }

  public function validateUpdate(): bool
  {
    if (empty($this->id))
      return false;

    return (
      !empty($this->name) &&
      !empty($this->surname) &&
      !empty($this->city_name) &&
      !empty($this->way_name) &&
      !empty($this->way_number)
    );
  }

  public function validateRemove(): bool
  {
    return !empty($this->id) && $this->enabled === false;
  }
}
