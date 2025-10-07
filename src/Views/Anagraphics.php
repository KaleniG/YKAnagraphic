<?php

use App\Core\Path;
use App\Core\AssetManager;

$asset = new AssetManager();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?= $asset->importCSS(); ?>
  <?= $asset->importJS(); ?>
  <title>Anagraphics</title>
</head>

<body>
  <form method="post">
    <?php if (isset($this->anagraphics)): ?>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>E-mail</th>
            <th>Phone Number</th>
            <th>City</th>
            <th>Way</th>
            <th>Number</th>
            <th>Enabled</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($this->anagraphics as $anagraphic):
            $id = $anagraphic["id"];
            $name = $anagraphic["name"];
            $surname = $anagraphic["surname"];
            $email = $anagraphic["email"];
            $phone_number = $anagraphic["phone_number"];
            $city_name = $anagraphic["city_name"];
            $way_name = $anagraphic["way_name"];
            $way_number = $anagraphic["way_number"];
            $checked = ($anagraphic["enabled"] == "t") ? "checked" : "";
          ?>
            <tr anagraphic-id="<?= $id ?>">
              <td><input type="text" name="name" value="<?= $name ?>" disabled></td>
              <td><input type="text" name="surname" value="<?= $surname ?>" disabled></td>
              <td><input type="email" name="email" value="<?= $email ?>"></td>
              <td><input type="number" name="phone_number" value="<?= $phone_number ?>"></td>
              <td><input type="text" name="city_name" value="<?= $city_name ?>"></td>
              <td><input type="text" name="way_name" value="<?= $way_name ?>"></td>
              <td><input type="text" name="way_number" value="<?= $way_number ?>"></td>
              <td><input type="checkbox" name="enabled" <?= $checked ?>></td>
              <td></td>
            </tr>
          <?php endforeach; ?>
          <tr id="new_row">
            <td><input type="text" name="name"></td>
            <td><input type="text" name="surname"></td>
            <td><input type="email" name="email"></td>
            <td><input type="number" name="phone_number"></td>
            <td><input type="text" name="city_name"></td>
            <td><input type="text" name="way_name"></td>
            <td><input type="text" name="way_number"></td>
            <td><input type="checkbox" name="enabled"></td>
            <td><button type="button">Add</button></td>
          </tr>
        </tbody>
      </table>
    <?php endif; ?>
  </form>
</body>

</html>

<!-- SCRIPTS LOADING -->
<script src="js/EditAnagraphics.js"></script>