// import makeRequest from '@/library/makeRequest';
// import { getRooms, setRooms } from '@/models/actions/roomsActions';
// import { ofType, combineEpics } from 'redux-observable';
// import { from } from 'rxjs';
// import { mergeMap, concatMap, map, withLatestFrom } from 'rxjs/operators';

// import catchErrorOperator from './operators/catchErrorOperator';

// const getRoomsEpic = (action$) =>
//   action$.pipe(
//     ofType(getRooms.type),
//     mergeMap(() =>
//       from(makeRequest('rooms', 'GET', '')).pipe(
//         concatMap((payload) => [setRooms(payload)]),
//         catchErrorOperator(false),
//       ),
//     ),
//   );

// export { getRoomsEpic };

// const epics = combineEpics(getRoomsEpic);

// export default epics;
