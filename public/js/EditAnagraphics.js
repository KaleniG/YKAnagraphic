$(document).ready(() => {
  $("tr[anagraphic-id]").each(function () {
    const row = $(this);
    const id = row.attr("anagraphic-id");
    const tdOperations = row.find("td:last");

    // Function to add Save button
    const addSaveButton = () => {
      if (tdOperations.find(".save-button").length === 0) {
        const saveBtn = $("<button>", {
          type: "button",
          text: "Save Changes",
          class: "save-button",
          click: function () {
            const dataToSend = {
              operation: "update",
              id: id,
              name: row.find("[name='name']").val(),
              surname: row.find("[name='surname']").val(),
              email: row.find("[name='email']").val(),
              phone_number: row.find("[name='phone_number']").val(),
              city_name: row.find("[name='city_name']").val(),
              way_name: row.find("[name='way_name']").val(),
              way_number: row.find("[name='way_number']").val(),
            };

            if (row.find("[name='enabled']").prop("checked")) {
              dataToSend.enabled = "yes";
            }

            console.info(dataToSend);

            $.ajax({
              url: "index.php",
              method: "POST",
              data: dataToSend,
              dataType: "json",
              success: (res) => {
                if (res.status !== "ok") alert("Failed to update record");
              },
              error: (xhr, status, error) => console.error(error)
            });
          }
        });
        tdOperations.append(saveBtn);
      }
    };

    // Function to add Remove button if unchecked
    const toggleRemoveButton = () => {
      tdOperations.find(".remove-button").remove();
      if (!row.find("[name='enabled']").prop("checked")) {
        const removeBtn = $("<button>", {
          type: "button",
          text: "Remove",
          class: "remove-button",
          click: function () {
            $.ajax({
              url: "index.php",
              method: "POST",
              data: {
                operation: "remove",
                id: id
              },
              dataType: "json",
              success: (res) => {
                if (res.status === "ok") row.remove();
                else alert("Failed to remove record");
              },
              error: (xhr, status, error) => console.error(error)
            });
          }
        });
        tdOperations.append(removeBtn);
      }
    };

    // Initial setup
    toggleRemoveButton();
    addSaveButton();

    // Toggle remove button when checkbox changes
    row.find("[name='enabled']").on("change", toggleRemoveButton);

    // Add Save button on input changes
    row.find("input[type!='checkbox']").on("input", addSaveButton);
  });

  $("#new_row button").on("click", (e) => {

    const dataToSend = {
      operation: "add",
      name: $("#new_row [name='name']").val(),
      surname: $("#new_row [name='surname']").val(),
      email: $("#new_row [name='email']").val(),
      phone_number: $("#new_row [name='phone_number']").val(),
      city_name: $("#new_row [name='city_name']").val(),
      way_name: $("#new_row [name='way_name']").val(),
      way_number: $("#new_row [name='way_number']").val()
    };

    if ($("#new_row [name='enabled']").prop("checked")) {
      dataToSend.enabled = "yes";
    }

    $.ajax({
      url: "index.php",
      method: 'POST',
      data: dataToSend,
      dataType: 'json',
      success: (res) => {
        if (res.status === "ok") {
          const newRow = `
              <tr anagraphic-id="${res.id}">
                <td><input type="text" name="name" value="${dataToSend.name}" disabled></td>
                <td><input type="text" name="surname" value="${dataToSend.surname}" disabled></td>
                <td><input type="email" name="email" value="${dataToSend.email}"></td>
                <td><input type="number" name="phone_number" value="${dataToSend.phone_number}"></td>
                <td><input type="text" name="city_name" value="${dataToSend.city_name}"></td>
                <td><input type="text" name="way_name" value="${dataToSend.way_name}"></td>
                <td><input type="text" name="way_number" value="${dataToSend.way_number}"></td>
                <td><input type="checkbox" name="enabled" ${dataToSend.enabled ? "checked" : ""}></td>
                <td></td>
              </tr>
            `;

          $("#new_row").before(newRow);
          $("#new_row input[type!='checkbox']").val('');
          $("#new_row [name='enabled']").prop('checked', false);
        } else {
          alert("Failed to add record");
        }
      },
      error: (xhr, status, error) => {
        console.error('AJAX error:', error);
      }
    });
  });
});