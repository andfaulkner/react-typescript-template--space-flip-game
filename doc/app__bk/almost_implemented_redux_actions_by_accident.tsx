
let actions2 = {};

let ac3: any = {};

export function buildActionCreator(actionName: string, payload: (() => any) | any, error?, meta?) {
  let acName = _.camelCase(actionName);
  actions2[actionName] = actionName;

  if (_.isFunction(payload)) {
    ac3[acName] = (argsGivenToActionCreator) => ({
      type: actionName,
      payload: payload(argsGivenToActionCreator),
    });

  } else if (_.isObject(payload)) {
    ac3[acName] = () => ({
      type: actionName,
      payload,
    });
  }
};

function actionCreatorFactory(actionMap: Array<(() => any) | any>) {
  _.reduce(actionCreatorFactory)
}


buildActionCreator('NEW_TEST_ACTION_YEP', { funk: 'brings it'});
buildActionCreator('NEW_TEST_ACTION_FN', age => ({ age }));
console.log('buildActionCreator output: actions2: ', actions2);
console.log('buildActionCreator output: ac3: ', ac3);

console.log('actions.tsx:: output: ac3.newTestActionFn(42): ', ac3.newTestActionFn(42));


// export function buildActionCreatorTwo(actionMapList: Array<ActionData>, error?, meta?) {
//   let actionSet = _.reduce(actionMapList, (actionMap, action, index) => {

//     let actionCreatorName = _.camelCase(action.name);

//     if (_.isFunction(action.payload)) {
//       console.log('actions.tsx:: payload was function!');
//       actionMap[actionCreatorName] = (...args) => ({
//         type: action.name,
//         payload: action.payload.apply(this, args),
//       });

//     } else if (_.isObject(action.payload)) {
//       console.log('actions.tsx:: payload was not function :(');
//       actionMap[actionCreatorName] = () => ({
//         type: action.name,
//         payload: action.payload,
//       });
//     }
//     return actionMap;
//   }, {});
//   console.log('actions.tsx:: actionSet: ', actionSet);
//   return actionSet;
// };
//