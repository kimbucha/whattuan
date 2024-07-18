"use client";

import React from "react";
import SectionHeading from "./Section-Heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";

import SubmitBtn from "./Submit-btn";
import toast from "react-hot-toast";

const Contact: React.FC = () => {
  const { ref } = useSectionInView("Contact");

  return (
    <motion.section
      ref={ref}
      id="contact"
      className="mb-20 sm:mb-28 w-[min(90%, 53rem)] mx-auto text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <SectionHeading>hmu</SectionHeading>
      <p className="text-gray-700 -mt-3 dark:text-white">
        @{" "}
        <a className="underline" href="mailto:kim.nguyen.afk@gmail.com">
          kim.nguyen.afk@gmail.com
        </a>{" "}
        or:
      </p>

      <form
        className="mt-10 flex flex-col dark:text-black"
        action={async (formData) => {
          const { data, error } = await sendEmail(formData);

          if (error) {
            toast.error("error");
            return;
          }

          toast.success("done!");
        }}
      >
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80  dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderEmail"
          type="email"
          required={true}
          maxLength={500}
          placeholder="Your email"
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80  dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          required={true}
          maxLength={5000}
          placeholder="Your message"
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
};

export default Contact;
