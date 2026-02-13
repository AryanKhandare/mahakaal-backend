module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("addresses", {
    street: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    zipCode: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    label: {
      type: Sequelize.STRING, // e.g. Home, Work
      defaultValue: 'Home'
    }
  });

  return Address;
};
