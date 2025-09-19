import styles from "./GroupMembers.module.css";

export default function GroupMembers({ members = [] }) {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className={styles.groupModule}>
      <h3 className={styles.title}>Trip Members ({members.length})</h3>
      <div className={styles.avatarList}>
        {members.map((member) => (
          <div
            key={member.id}
            className={styles.avatar}
            title={`${member.first_name} ${member.last_name}`}
          >
            {getInitials(member.first_name, member.last_name)}
          </div>
        ))}
      </div>
    </div>
  );
}
