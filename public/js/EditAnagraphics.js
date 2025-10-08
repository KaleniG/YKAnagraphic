function addRow(element, index) {
  const row = $("<tr>", { "anagraphic-id": element.id });

  const updateGatherInfo = () => {
    const updateInfo = {
      operation: "update",
      id: element.id,
      name: nameInput.val(),
      surname: surnameInput.val(),
      email: emailInput.val(),
      phone_number: phoneNumberInput.val(),
      city_name: cityNameInput.val(),
      way_name: wayNameInput.val(),
      way_number: wayNumberInput.val()
    };
    if (enabledInput.prop("checked"))
      updateInfo.enabled = "yes";

    return updateInfo;
  };

  const updateOperation = () => {
    $.ajax({
      url: "index.php",
      method: "POST",
      data: updateGatherInfo(),
      dataType: "json",
      success: (res) => {
        if (res.status === "ok") {
          row.addClass("saved");
          setTimeout(() => row.removeClass("saved"), 1200);
        } else {
          alert("Failed to update record");
        }
      },
      error: (xhr, status, error) => console.error(error)
    });
  };

  const removeOperation = () => {
    $.ajax({
      url: "index.php",
      method: "POST",
      data: { operation: "remove", id: element.id },
      dataType: "json",
      success: (res) => {
        if (res.status === "ok") {
          if (res.status === "ok") {
            row.fadeOut(400, () => row.remove());
            delete anagraphicsData[index];
          }
        }
        else alert("Failed to remove record");
      },
      error: (xhr, status, error) => console.error(error)
    });
  };

  const nameInput = $("<input>", { type: "text", value: element.name, class: "edit", disabled: true });
  const surnameInput = $("<input>", { type: "text", value: element.surname, class: "edit", disabled: true });
  const emailInput = $("<input>", { type: "email", value: element.email, class: "edit", }).on("change", updateOperation);
  const phoneNumberInput = $("<input>", { type: "number", value: element.phone_number, class: "edit", }).on("change", updateOperation);
  const cityNameInput = $("<input>", { type: "text", value: element.city_name, class: "edit", }).on("change", updateOperation);
  const wayNameInput = $("<input>", { type: "text", value: element.way_name, class: "edit", }).on("change", updateOperation);
  const wayNumberInput = $("<input>", { type: "text", value: element.way_number, class: "edit", }).on("change", updateOperation);
  const enabledInput = $("<input>", { type: "checkbox", class: "edit", checked: (element.enabled == "t") ? true : false });

  const removeButton = $("<button>", {
    type: "button",
    text: "Remove",
    class: "remove-button edit",
    click: removeOperation
  });

  enabledInput.on("change", function () {
    updateOperation();
    const td = row.find("td:last");
    td.find(".remove-button").remove();
    if (!$(this).prop("checked")) {
      td.append(removeButton);
    }
  });

  row.append($("<td>").append(nameInput));
  row.append($("<td>").append(surnameInput));
  row.append($("<td>").append(emailInput));
  row.append($("<td>").append(phoneNumberInput));
  row.append($("<td>").append(cityNameInput));
  row.append($("<td>").append(wayNameInput));
  row.append($("<td>").append(wayNumberInput));
  row.append($("<td>").append(enabledInput));
  row.append($("<td>"));

  if (!(element.enabled == "t")) row.find("td:last").append(removeButton);

  row.css("display", "none");
  $("tbody tr:last").before(row);
  row.delay(index * 100).fadeIn(300);
}

function handlePopulate() {
  Object.values(anagraphicsData).forEach((element, index) => {
    addRow(element, index);
  });
}

function handleAddSection() {
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
          const element = {
            id: res.id,
            name: dataToSend.name,
            surname: dataToSend.surname,
            email: dataToSend.email,
            phone_number: dataToSend.phone_number,
            city_name: dataToSend.city_name,
            way_name: dataToSend.way_name,
            way_number: dataToSend.way_number,
            enabled: dataToSend.enabled ? "t" : "f"
          };

          addRow(element, 1);

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
}

$(document).ready(() => {
  handlePopulate();
  handleAddSection();
});