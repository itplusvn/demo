/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
};

