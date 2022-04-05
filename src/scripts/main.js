import('lodash').then(({ default: _ }) => {
  console.log(
    _.map(['Hello', 'World'], (item) => {
      return item;
    }).join(' '),
  );
}).catch(error => 'An error occurred while loading the module');
