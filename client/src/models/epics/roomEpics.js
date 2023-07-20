import { manipulateUsers, setUsers } from 'models/actions/roomActions';
import { ofType, combineEpics } from 'redux-observable';
import { map, withLatestFrom } from 'rxjs/operators';

// TODO - NOT USED AT THE MOMENT
const manipulateUsersEpic = (action$, state$) =>
  action$.pipe(
    ofType(manipulateUsers.type),
    withLatestFrom(state$),
    map(
      ([
        { payload },
        {
          roomReducer: { nickName },
        },
      ]) => {
        debugger;

        const newUsers = payload?.users
          ?.filter((us) => us.user !== nickName)
          ?.map((u) => u?.user);

        return setUsers(newUsers);
      },
    ),
  );

export { manipulateUsersEpic };

const epics = combineEpics(manipulateUsersEpic);

export default epics;
