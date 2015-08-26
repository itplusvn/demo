/**
* Posts.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title:{
      type:'string',
      required: true
    },
    shortDescription:{
      type:'string'
    },
    description:{
      type:'string'
    },
    thumb: {
      type: 'string'
    },
    category:{
      type:'string'
    },

    tags:{
      type:'string'
    }
  }
};

