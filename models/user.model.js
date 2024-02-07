const db  =  require('./index');
const { DataTypes} = require('sequelize');
const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:" First Name should not be Empty "
            }
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:" Last Name should not be Empty "
            }
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    validate:{
        notEmpty:{
            msg:" Password should not be Empty "
        }
    }

    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg:" Username should be unique "
        },
        validate:{
            isEmail: {
                msg:" Please Enter valid email address "
            },
            notEmpty:{
                msg:" Email address should not be Empty "
            }
        }
    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: db.Sequelize.NOW,
        allowNull: false
    },
    account_updated: {
        type: DataTypes.DATE,
        defaultValue: db.Sequelize.NOW,
        allowNull: false
    },
},{
    createdAt: 'account_created',
    updatedAt: 'account_updated',
});

module.exports = User;
