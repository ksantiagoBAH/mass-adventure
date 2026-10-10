export type Point = { x: number; y: number };
export const rightShoulder = { x: 106, y: 113 }, leftShoulder = { x: 154, y: 113 };
const relaxedLeftHand = { x: 162, y: 180 };
// Match the original shoulder anchors; keep the elbow below the shoulder.
function elbow(shoulder: Point, hand: Point, direction = 1): Point {
  const dx = hand.x - shoulder.x, dy = hand.y - shoulder.y;
  const distance = Math.max(6, Math.hypot(dx, dy));
  const reach = (37 * 37 - 42 * 42 + distance * distance) / (2 * distance);
  const bend = Math.sqrt(Math.max(0, 37 * 37 - reach * reach)) * direction;
  return { x: shoulder.x + dx / distance * reach - dy / distance * bend,
    y: shoulder.y + dy / distance * reach + dx / distance * bend };
}
const artwork = `${import.meta.env.BASE_URL}artwork/sign-of-cross/`;
function ArmSegment({ from, to, kind, width }: { from: Point; to: Point; kind: string; width: number }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI - 90;
  return <g transform={`translate(${from.x} ${from.y}) rotate(${angle})`}>
    <image href={`${artwork}${kind}.webp`} x={-width / 2} y={-2} width={width} height={length + 4} preserveAspectRatio="none" />
  </g>;
}
export function CartoonArm({ shoulder, hand, left, handOpacity = 1, tuck = 0 }: { shoulder: Point; hand: Point; left?: boolean; handOpacity?: number; tuck?: number }) {
  const anchor = left ? { x: 160, y: 120 } : { x: 100, y: 120 };
  const naturalJoint = elbow(anchor, hand, left ? -1 : 1);
  const lift = Math.max(0, Math.min(1, (relaxedLeftHand.y - hand.y) / (relaxedLeftHand.y - 136)));
  const rest = Math.max(0, Math.min(1, (hand.y - 150) / 30));
  const restEase = rest * rest * (3 - 2 * rest);
  const joint = left ? { x: 158 + 2 * lift, y: 147 + 3 * lift }
    : { x: (naturalJoint.x + (shoulder.x - naturalJoint.x) * tuck) * (1 - restEase) + 102 * restEase,
      y: (naturalJoint.y + (150 - naturalJoint.y) * tuck) * (1 - restEase) + 147 * restEase };
  const handAngle = left ? Math.PI * (1 - lift) : 0;
  // The hand's wrist sits at the forearm end, rather than below it.
  const wrist = { x: hand.x - 7 * Math.sin(handAngle) * handOpacity,
    y: hand.y + 7 * Math.cos(handAngle) * handOpacity };
  return <g className={left ? "cross-left-arm" : "cross-right-arm"} data-elbow-x={joint.x} data-elbow-y={joint.y} data-wrist-x={wrist.x} data-wrist-y={wrist.y}>
    <ArmSegment from={shoulder} to={joint} kind="upper-arm" width={17} />
    <ArmSegment from={joint} to={wrist} kind="forearm" width={11} />
    <g opacity={handOpacity} transform={`translate(${hand.x} ${hand.y}) rotate(${handAngle * 180 / Math.PI}) scale(${left ? -1 : 1} 1)`}>
      <image href={`${artwork}hand-inward.webp`} x={-7} y={-15} width={14} height={23} preserveAspectRatio="none" />
    </g>
  </g>;
}
