import React from "react";
import { AttributeWithId } from "../../../models/attributes";
import RuleView from "./view";
import { useSelector, useDispatch } from "react-redux";
import { Bucket, BucketContainer } from "../../../models/bucket";
import { deleteRuleFromBucket } from "../../../redux/actions/bucket";

export default function RuleController({
  bucketIndex,
  bucketKey,
  rule,
  conditionLogic,
}: {
  bucketIndex: number;
  bucketKey: keyof BucketContainer;
  rule: AttributeWithId;
  conditionLogic: string | undefined;
}) {
  const dispatch = useDispatch();
  const ruleMetadata = useSelector(
    (state: any) => state.attributeReducer[rule.type]
  );

  const handleDelete = () => {
    dispatch(
      deleteRuleFromBucket({
        bucketType: bucketKey,
        bucketIndex: bucketIndex,
        ruleId: rule.id,
      })
    );
  };

  return (
    <RuleView
      rule={rule}
      conditionLogic={conditionLogic}
      ruleMetadata={ruleMetadata}
      handleDelete={handleDelete}
    />
  );
}
