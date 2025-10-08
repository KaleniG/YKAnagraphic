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
    <div class="edit navbar">
      <select class="edit navbar">
        <option value="" selected>No filter</option>
        <option value="enabled">Enabled Records</option>
        <option value="disabled">Disabled Records</option>
      </select>
    </div>
    <?php if (isset($this->anagraphics)): ?>
      <table class="edit">
        <thead>
          <tr>
            <th data-field="name" data-order="none">Name</th>
            <th data-field="surname" data-order="none">Surname</th>
            <th data-field="email" data-order="none">E-mail</th>
            <th>Phone Number</th>
            <th data-field="city_name" data-order="none">City</th>
            <th data-field="way_name" data-order="none">Way</th>
            <th>Number</th>
            <th>Enabled</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr id="new_row">
            <td><input type="text" name="name" class="edit" autocomplete="off" autocorrect="off" autocapitalize="on" spellcheck="false"></td>
            <td><input type="text" name="surname" class="edit" autocomplete="off" autocorrect="off" autocapitalize="on" spellcheck="false"></td>
            <td><input type="email" name="email" class="edit" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></td>
            <td><input type="number" name="phone_number" class="edit" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></td>
            <td><input type="text" name="city_name" class="edit" autocomplete="off" autocorrect="off" autocapitalize="on" spellcheck="false"></td>
            <td><input type="text" name="way_name" class="edit" autocomplete="off" autocorrect="off" autocapitalize="on" spellcheck="false"></td>
            <td><input type="text" name="way_number" class="edit" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></td>
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
  const ordered = anagraphicsData;
</script>
<script src="js/EditAnagraphics.js"></script>