import _ from 'lodash';

console.log(
  _.map(['Hello', 'World'], (item) => {
    return item;
  }).join(' '),
);
