import React from "react";
import { Button, Form, Input } from "antd";

export type AnswerKeyTest = [TestInfo];
export type GradedTestResult = {
  updated_papers: AnswerKeyTest;
};
export type GradeTest = {
  answer_key: TestInfo;
  test_papers: TestInfo[];
};
export type Annotation = {
  box: [];
  text: string;
};
export type TestInfo = {
  original_url: string;
  generated_uid: string;
  original_size: [];
  full_data: [Annotation];
  full_section: string;
  Question_pair: {
    image_name: string;
    student_info: {
      university: string;
      college: string;
      department: string;
      exam_type: string;
      subject_code: string;
      subject_name: string;
      name: string;
      date: string;
      program_code: string;
      total_score: number | null;
    };
    tests: Test[];
  };
};

export type Test = {
  test_number: number;
  test_type: string;
  total_points: number;
  correct_points: number | null;
  full_text: string;
  question_answer_pairs: TestItem[];
};
export type TestItem = {
  question_number: number;
  answer: string;
};
export const AnswerKeyForm = ({
  tests,
  onSubmit,
}: {
  tests: Test[];
  onSubmit: (values: { [key: string]: string }) => void;
}) => {
  const [form] = Form.useForm();

  const initialValues = tests.reduce((values, test) => {
    test.question_answer_pairs.forEach((testItem) => {
      values[`${test.test_number}-${testItem.question_number}`] =
        testItem.answer;
    });
    return values;
  }, {} as { [key: string]: string });

  return (
    <Form
      form={form}
      style={{ maxWidth: 600 }}
      onFinish={onSubmit}
      initialValues={initialValues}
    >
      {tests.map((test) => {
        return (
          <>
            <h2>{test.test_type}</h2>
            {test.question_answer_pairs.map((testItem) => {
              return (
                <Form.Item
                  name={`${test.test_number}-${testItem.question_number}`}
                  label={`${testItem.question_number}`}
                  // value={testItem.answer || null}
                  required={true}
                >
                  <Input placeholder="Question 1" />
                </Form.Item>
              );
            })}
          </>
        );
      })}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
