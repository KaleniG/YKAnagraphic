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

<body class="edit">
  <form method="post" class="edit">
    <?php if (isset($this->anagraphics)): ?>
      <table class="edit">
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
          <tr id="new_row">
            <td><input type="text" name="name" class="edit"></td>
            <td><input type="text" name="surname" class="edit"></td>
            <td><input type="email" name="email" class="edit"></td>
            <td><input type="number" name="phone_number" class="edit"></td>
            <td><input type="text" name="city_name" class="edit"></td>
            <td><input type="text" name="way_name" class="edit"></td>
            <td><input type="text" name="way_number" class="edit"></td>
            <td><input type="checkbox" name="enabled" class="edit"></td>
            <td><button type="button" class="edit">Add</button></td>
          </tr>
        </tbody>
      </table>
    <?php endif; ?>
  </form>
</body>

</html>

<!-- SCRIPTS LOADING -->
<script>
  const anagraphicsData = <?= json_encode($this->anagraphics, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
</script>
<script src="js/EditAnagraphics.js"></script>