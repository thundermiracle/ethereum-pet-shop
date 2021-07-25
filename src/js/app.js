App = {
  web3Provider: null,
  contracts: {
    Adoption: null,
  },

  init: async function () {
    // Load pets.
    $.getJSON("pets.json", function (data) {
      var petsRow = $("#petsRow");
      var petTemplate = $("#petTemplate");

      for (i = 0; i < data.length; i++) {
        petTemplate.find(".panel-title").text(data[i].name);
        petTemplate.find("img").attr("src", data[i].picture);
        petTemplate.find(".pet-breed").text(data[i].breed);
        petTemplate.find(".pet-age").text(data[i].age);
        petTemplate.find(".pet-location").text(data[i].location);
        petTemplate.find(".btn-adopt").attr("data-id", data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    await App.initWeb3();

    App.initContract();
    App.bindEvents();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      // Modern dapp browser
      App.web3Provider = window.ethereum;
      try {
        // request account access
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      // Legacy dapp browser
      App.web3Provider = window.web3.currentProvider;
    } else {
      // Fallback to localhost ganache
      App.web3Provider = new Web3.provider.HttpProvider(
        "http://localhost:7545"
      );
    }

    // initialize global web3
    web3 = new Web3(App.web3Provider);
  },

  initContract: function () {
    $.getJSON("Adoption.json", function (data) {
      const AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // set the provider
      App.contracts.Adoption.setProvider(App.web3Provider);

      // use our contracts to retrieve and mark the adopted pets
      return App.markAdopted();
    });
  },

  bindEvents: function () {
    $(document).on("click", ".btn-adopt", App.handleAdopt);
  },

  markAdopted: function () {
    // define adoptionInstance to prevent multiple requests
    let adoptionInstance;

    App.contracts.Adoption.deployed()
      .then((instance) => {
        adoptionInstance = instance;
        return adoptionInstance.getAdopters.call();
      })
      .then((adopters) => {
        for (i = 0; i < adopters.length; i++) {
          if (adopters[i] !== "0x0000000000000000000000000000000000000000") {
            $(".panel-pet")
              .eq(i)
              .find("button")
              .text("Success")
              .attr("disabled", true);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    const petId = parseInt($(event.target).data("id"));

    web3.eth.getAccounts(function (err, accounts) {
      if (err) {
        console.log(err);
      }

      // define adoptionInstance to prevent multiple requests
      let adoptionInstance;
      const account = accounts[0];

      App.contracts.Adoption.deployed()
        .then((instance) => {
          adoptionInstance = instance;
          return adoptionInstance.adopt(petId, { from: account });
        })
        .then(() => {
          return App.markAdopted();
        })
        .catch((err) => {
          console.error(err.message);
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
