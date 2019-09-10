App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
        console.log("panel-title : ",data[i].name);
        console.log("btn-adopt",data[i].id);
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {

    console.log('web3 is not defined..');
    // set the provider you want from Web3.providers
    App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    web3 = new Web3(App.web3Provider);
    return App.initContract();

    // Modern dapp browsers...
    // if (window.ethereum) {
    //   App.web3Provider = window.ethereum;
    //   try {
    //     // Request account access
    //     await window.ethereum.enable();
    //   } catch (error) {
    //     // User denied account access...
    //     console.error("User denied account access")
    //   }
    // }
    // // Legacy dapp browsers...
    // else if (window.web3) {
    //   App.web3Provider = window.web3.currentProvider;
    // }
    // // If no injected web3 instance is detected, fall back to Ganache
    // else {
    //   App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    // }
    // web3 = new Web3(App.web3Provider);
  },

  initContract: function() {
    /*
     * Replace me...
     */
    $.getJSON('Adoption.json', function(data) {
      // test해보기
      console.log('success to load tt...',data);
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract.
      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
    //contract / UI / JS 
    //UI가 들어오면 adopt를 16개 보여주는데 실제 adopt되어있는지는 모른다.
    //DB대신 블록체인을 활용해 adopt된 정보를 가져오기
  //   console.log("*******ADOPTED*******");

  //   var adoptionInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }
  //     var account = accounts[0];
      
  //   App.contracts.Adoption.deployed().then(function(instance) {
  //     adoptionInstance = instance;

  //     return adoptionInstance.getAdopters.call();
  //   }).then(function(result) {
  //     console.log(result);

  //     for (i = 0; i < result.length; i ++) {
  //       console.log("result[",i,"]",result[i]);
  //       if(result[i] === "0x0000000000000000000000000000000000000000"){
  //         $(".btn-adopt").text('success');
  //       }
  //     }
  //   }).catch(function(err) {
  //     console.log(err.message);
  //   });
  // });
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
    
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
    console.log("입양되었습니다.");
  //   var adoptionInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];
      
  //   App.contracts.Adoption.deployed().then(function(instance) {
  //     adoptionInstance = instance;

  //     return adoptionInstance.adopt(petId, {from: account});
  //   }).then(function(result) {
  //     alert('Adopted Successful!');
  //     //return App.getBalances();
  //     console.log(petId);
  //     console.log(account);
  //     return App.markAdopted();
  //   }).catch(function(err) {
  //     console.log(err.message);
  //   });
  // });



  var adoptionInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      // Execute adopt as a transaction by sending account
      return adoptionInstance.adopt(petId, {from: account});
    }).then(function(result) {
      return App.markAdopted();
    }).catch(function(err) {
      console.log(err.message);
    });
  });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
