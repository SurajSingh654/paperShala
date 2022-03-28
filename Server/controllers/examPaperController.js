const ExamPaper = require("./../models/examPaperModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const catchAsync = require("./../utils/catchAsync.js");
const Question = require("./../models/questionModel.js");
const Class = require("./../models/classModel.js");
const AppError = require("./../utils/appError.js");
const validator = require("validator");
const { promisify } = require("util");
const mongooseDynamic = require("mongoose-dynamic-schemas");
const addField = (questionType) => {
  if (questionType === "Multiple Choice Question{Single Correct}")
    return "totalMCQSingleCorrect";
  if (questionType === "Multiple Choice Question{Multi Correct}")
    return "totalMCQMultiCorrect";
  if (questionType === "Fill In The Blanks") return "totalFillUps";
  if (questionType === "One Word") return "totalOneWord";
  if (questionType === "Short Answer") return "totalShortAnswers";
  if (questionType === "Long Answer") return "totalLongAnswers";
  if (questionType === "Matching") return "totalMatchings";
  if (questionType === "True/False") return "totalTrueFalse";
};
exports.setTeacherId_OrganizationId_ClassId = catchAsync(
  async (req, res, next) => {
    if (req.params.organizationId) {
      if (!req.user.organizations.includes(req.params.organizationId)) {
        return next(
          new AppError(
            "You are not allowed to add paper related to this organization!",
            404
          )
        );
      } else {
        if (req.params.classId) {
          const myClass = await Class.findById(req.params.classId);
          if (!myClass) {
            return next(
              new AppError(
                "You are not allowed to add question in this class!",
                404
              )
            );
          } else {
            if (myClass.teacher != req.user.id) {
              return next(
                new AppError(
                  "You are not allowed to add paper for this class",
                  404
                )
              );
            }
          }
        }
      }
    }
    req.body.organization = req.params.organizationId;
    req.body.class = req.params.classId;
    req.body.teacher = req.user.id;
    req.body.questions = [];

    // Get ALl QUestions for specific teacher
    const allQuestionsInDatabase = await Question.find({
      organization: req.params.organizationId,
      class: req.params.classId,
      teacher: req.user.id,
    });

    console.log(`All Questions in database ${allQuestionsInDatabase}`);

    // Check if questions present in database is greater than or equalto number of questions required!
    if (allQuestionsInDatabase.length < req.body.totalQuestions) {
      return next(
        new AppError(
          `You have only ${data.length} questions available in the database...`,
          404
        )
      );
    }

    // Types of questions present in database
    const allQuestionTypes = allQuestionsInDatabase.map(
      (question) => question.questionType
    );

    console.log(`All QuestionTypes in database ${allQuestionTypes}`);

    // Total Number of Questions of Each Type
    const eachQuestionTypeWithFrequency = {};
    allQuestionTypes.forEach((e) =>
      eachQuestionTypeWithFrequency[e]
        ? eachQuestionTypeWithFrequency[e]++
        : (eachQuestionTypeWithFrequency[e] = 1)
    );

    console.log(Object.entries(eachQuestionTypeWithFrequency));

    // Sum of all questions{of any type} required!
    let sumOfQuestionsOfAllTypes = 0;

    for (const [key, value] of Object.entries(eachQuestionTypeWithFrequency)) {
      const fieldOfSpecificQuestionType = addField(key) + "";
      console.log(`fieldOfSpecificQuestionType ${fieldOfSpecificQuestionType}`);
      let questionsNeededOfSpecificType = 0;
      if (fieldOfSpecificQuestionType === "totalMCQSingleCorrect") {
        questionsNeededOfSpecificType = req.body.totalMCQSingleCorrect;
      }
      if (fieldOfSpecificQuestionType === "totalTrueFalse") {
        questionsNeededOfSpecificType = req.body.totalTrueFalse;
      }
      console.log(
        `questionsNeededOfSpecificType ${questionsNeededOfSpecificType}`
      );
      if (
        questionsNeededOfSpecificType &&
        questionsNeededOfSpecificType > value
      ) {
        return next(new AppError(`${key} present in database is ${value}`));
      }
      sumOfQuestionsOfAllTypes += questionsNeededOfSpecificType;
    }
    // for (const [key] of Object.entries(eachQuestionTypeWithFrequency)) {
    //   await mongooseDynamic.addSchemaField(ExamPaper, addField(key), {
    //     type: Number,
    //   });
    // }
    if (sumOfQuestionsOfAllTypes > req.body.totalQuestions) {
      console.log(sumOfQuestionsOfAllTypes, req.body.totalQuestions);
      return next(
        new AppError(
          `sum of all specific type of questions ${sumOfQuestionsOfAllTypes} is greater than total questions ${req.body.totalQuestions} `,
          401
        )
      );
    }
    if (sumOfQuestionsOfAllTypes < req.body.totalQuestions) {
      console.log(sumOfQuestionsOfAllTypes, req.body.totalQuestions);
      return next(
        new AppError(
          "sum of all specific type of questions is less than total questions ",
          401
        )
      );
    }

    // Select questions Randomly
    for (const [key, value] of Object.entries(eachQuestionTypeWithFrequency)) {
      const questionsOfSpecificType = await Question.find({
        questionType: key,
      });
      for (let i = 0; i < value; ) {
        const random = Math.floor(
          Math.random() * questionsOfSpecificType.length
        );
        if (
          req.body.questions.indexOf(questionsOfSpecificType[random]._id) >= 0
        ) {
          continue;
        } else {
          req.body.questions.push(questionsOfSpecificType[random]._id);
        }
        i++;
      }
    }
    next();
  }
);
exports.deleteExamPaper = factory.deleteOne(ExamPaper);
exports.updateExamPaper = factory.updateOne(ExamPaper);
exports.createExamPaper = factory.createOne(ExamPaper);
exports.getExamPaper = factory.getOne(ExamPaper);
exports.getAllExamPapers = factory.getAll(ExamPaper);
