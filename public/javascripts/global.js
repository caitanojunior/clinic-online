// Clientlist data array for filling in info box
var clientListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the client table on initial page load
    populateTable();

});

// Functions =============================================================

// funçao que preenche a tabela com dados do banco
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/clients/clientlist', function( data ) {
		
		// Stick our user data array into a userlist variable in the global object
		clientListData = data;
		
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowclient" rel="' + this.fullname + '">' + this.fullname + '</a></td>';									
            tableContent += '<td>' + this.telefone + '</td>';
            tableContent += '<td>' + this.agendamentoData + ' ' + '<font color = "#FF0000"><b>' + this.agendamentoHora + '</b></font>'+ '</td>';
            tableContent += '<td><a href="#" class="linkdeleteclient" rel="' + this._id + '">Cancelar</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    }); 
};

// funcao que mostra informacoes do cliente selecionado
	function showClientInfo(event) {

		// Prevent Link from Firing
		event.preventDefault();

		// Retrieve fullname from link rel attribute
		var thisClientName = $(this).attr('rel');

		// Get Index of object based on id value
		var arrayPosition = clientListData.map(function(arrayItem) { return arrayItem.fullname; }).indexOf(thisClientName);
		
		// Get our Client Object
		var thisClientObject = clientListData[arrayPosition];

		//Populate Info Box
		$('#clientInfoName').text(thisClientObject.fullname);
		$('#clientInfoTelefone').text(thisClientObject.telefone);
		$('#clientInfoAgendamentoData').text(thisClientObject.agendamentoData);
        $('#clientInfoAgendamentoHora').text(thisClientObject.agendamentoHora);
	};

	// Add Client
function addClient(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addClient input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newClient = {
            'fullname': $('#addClient fieldset input#inputClientFullname').val(),
            'telefone': $('#addClient fieldset input#inputClientTelefone').val(),
            'agendamentoData': $('#addClient fieldset input#inputClientAgendamentoData').val(),
            'agendamentoHora': $('#addClient fieldset input#inputClientAgendamentoHora').val()
        }

        // Use AJAX to post thisClientObject object to our addclient service
        $.ajax({
            type: 'POST',
            data: newClient,
            url: '/clients/addclient',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addClient fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Por favor preencha todos os campos!');
        return false;
    }
};
	
	// Fullname link click
    $('#userList table tbody').on('click', 'td a.linkshowclient', showClientInfo);

    // Add Client button click
    $('#btnAddClient').on('click', addClient);
