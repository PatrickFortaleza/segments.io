import { Action } from "../../models/action";
import { User } from "../../models/user";
import { checkRules, computeEquation } from "../../utility";
import { dCondition } from "../../models/condition";

const inititalState = {
  users: <Array<User>>[],
  filteredUsers: <Array<User>>[],
};

const users = (state = inititalState, action: Action) => {
  let usersState = { ...state };
  switch (action.type) {
    case "initialize_users": {
      return { ...usersState, users: action.payload };
    }
    case "apply_filters": {
      let { rules } = action.payload;
      let users = usersState.users;

      if (
        !rules ||
        (!Array.isArray(rules.includes) && !Array.isArray(rules.excludes)) ||
        (rules.includes.length < 1 && rules.excludes.length < 1)
      )
        return { ...usersState, filteredUsers: [] };

      let filtered = users.filter((user) => {
        let includes, excludes;

        includes = rules.includes
          .filter((condition: dCondition) => condition.rules.length > 0)
          .map((condition: dCondition) => {
            let { operator } = condition;
            let rules = condition.rules
              .filter(
                (rule) =>
                  (typeof rule.attribute === "boolean" ||
                    rule.attribute === 0 ||
                    rule.attribute) &&
                  (typeof rule.value === "boolean" ||
                    rule.value === 0 ||
                    rule.value)
              )
              .map((rule) => {
                let { attribute, equation, value } = rule;
                return computeEquation({
                  equation,
                  attribute: user[attribute as keyof User],
                  value,
                });
              });

            return checkRules({ operator, rules });
          });

        excludes = rules.excludes
          .filter((condition: dCondition) => condition.rules.length > 0)
          .map((condition: dCondition) => {
            let { operator } = condition;
            let rules = condition.rules
              .filter(
                (rule) =>
                  (typeof rule.attribute === "boolean" ||
                    rule.attribute === 0 ||
                    rule.attribute) &&
                  (typeof rule.value === "boolean" ||
                    rule.value === 0 ||
                    rule.value)
              )
              .map((rule) => {
                let { attribute, equation, value } = rule;
                return computeEquation({
                  equation,
                  attribute: user[attribute as keyof User],
                  value,
                });
              });

            return checkRules({ operator, rules });
          });

        return (
          includes.every((rule: boolean) => rule === true) &&
          excludes.every((rule: boolean) => rule === false)
        );
      });

      return { ...usersState, filteredUsers: filtered };
    }
    default: {
      return { ...usersState };
    }
  }
};
export default users;
