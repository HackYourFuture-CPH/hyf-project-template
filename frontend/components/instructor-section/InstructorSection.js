import Image from "next/image";
import styles from "./InstructorSection.module.css";
import { flattenedDecrypt } from "jose";

const InstructorSection = () => {
  return (
    <div className={styles.container}>
      <div>
        <Image
          src="/images/instructor.png"
          alt="Instructor Image"
          className={styles.image}
          unoptimized={true}
          width={500}
          height={600}
        />
      </div>

      <div className={styles.textContainer}>
        <h1 className={styles.heading}>Make Money <br/>While Making an <br/> Impact</h1>
        <p className={styles.paragraph}>
          Empower minds, share your expertise, and earn a steady <br/> income—create
          courses that change lives while building <br/> your financial freedom!
        </p>
        <button className={styles.button}>Become An Instructor</button>
      </div>
    </div>
  );
};

export default InstructorSection;
