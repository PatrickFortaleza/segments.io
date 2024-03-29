import { useEffect, useState } from "react";
import BucketView from "./view";
import { Bucket } from "../../../models/bucket";
import { useSelector } from "react-redux";
import { Condition } from "../../../models/condition";
import { LegacyRef } from "react";

export default function BucketController({
  bucket,
  anchorRef,
}: {
  bucket: Bucket;
  anchorRef: LegacyRef<HTMLDivElement> | undefined;
}) {
  const [bucketConditions, setBucketConditions] = useState<Array<Condition>>(
    []
  );
  const { conditions } = useSelector((state: any) => state.entities);

  useEffect(() => {
    let bucketConditions_: Array<Condition> = Object.values(conditions).filter(
      (condition: any): condition is Condition =>
        condition.bucket_id === bucket.id
    );
    setBucketConditions(bucketConditions_);
  }, [conditions, Object.keys(conditions).length]);

  return (
    <BucketView bucketConditions={bucketConditions} anchorRef={anchorRef} />
  );
}
