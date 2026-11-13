import { IFormInput } from "../../Layouts/CRMTrials/Create/Create";

export interface CallInfo {
  answered_call: string | undefined;
  status: string | null;
  schedule_date: Date | null;
  schedule_time: Date | null;
  has_time: string;
  reschedule_date: Date | null;
  reschedule_time: Date | null;
  type?: string;
}

export interface HypercareOrders {
  sku: string | undefined;
  variant: string | undefined;
  description: string | undefined;
  uom: string | undefined;
  quantity: string | undefined;
}

export interface HypercareFeedback {
  title: string;
  response: string | null;
  selections: string[];
}

export interface MomentFeedback {
  title: string;
  response: string;
  selections: string[];
}

export interface HypercareScheduleLogs {
  type: string;
  reason: string;
  date: string;
  time: string;
}

export interface HypercareAddress {
  unit: string | undefined;
  city: string;
  address1: string;
  address2: string;
  barangay: string;
  province: string;
  zip_code: string;
  region: string;
}

export interface HypercareFormInput {
  customer_id: string;
  hypercare_id?: string;
  service_appointment_number?: string | undefined;
  week: string;
  call_info: CallInfo;
  continue_feedback: string;
  feedbacks: HypercareFeedback[];
  moments_morning?: MomentFeedback[];
  moments_afternoon?: MomentFeedback[];
  moments_night?: MomentFeedback[];
  moments_others?: MomentFeedback[];
  interested_to_zyn: string;
  extended_adoption: string;
  consumer_address: HypercareAddress;
  delivery_date: Date | null;
  delivery_time: Date | null;
  feedback_date: Date | null;
  feedback_time: Date | null;
  different_address: string;
  date: string;
  time: string;
  orders: HypercareOrders[];
  schedule_logs: HypercareScheduleLogs[];
  status: string;
  discontinue_reason?: string | undefined | null;
  gt_date?: Date | null;
  gt_time?: Date | null;
  not_interested_to_zyn: string | undefined | null;
  order_id?: string;
}
export const likeChoices = [
  "1 - Not like it at all",
  "2 - Fairly not like",
  "3 - Slightly not like",
  "4 - Neutral",
  "5 - Slightly like",
  "6 - Fairly like",
  "7 - Like it very much",
];

export const minutesChoices = [
  "1 - Less than 5 minutes",
  "2 - 5-10 minutes",
  "3 - 11-15 minutes",
  "4 - 16-20 minutes",
  "5 - 21-30 minutes",
  "6 - 31 -40 minutes ",
  "7 - 41-50 minutes",
  "8 - 51-60 minutes",
  "9 - More than 60 minutes",
];

export const usageChoices = [
  "I would switch to use this product exclusively",
  "I would use this product to replace some of my nicotine contained products, but not switch entirely",
  "I would use this product as just another way to consume nicotine contained products",
  "I would use this product only places where I would hesitate to consume nicotine contained products (for example in the car or at home indoors)",
  "I would not use this product",
];

export const opinionChoices = [
  "Not at all	strong enough",
  "Not quite strong enough",
  "Just right",
  "Somewhat too strong",
  "Much too strong",
];

export const productLikeChoices = [
  "Convenient/ easy to use",
  "No lighter needed",
  "No need of a device",
  "Like the taste",
  "Produces no ash",
  "I am less likely to bother other people around me, compared to conventional cigarettes",
  "Produces less odor than conventional cigarettes",
  "Has long lasting sweet/menthol taste",
  "Others",
];

export const productDislikeChoices = [
  "Taste is too strong",
  "I didn't like the taste experience",
  "Strong nicotine level",
  "I don't like the feeling in my throat when using it",
  "I don't like the aftertaste",
  "Has no Taste",
  "Feels hot in the gums.",
  " Head Hurts or Dizzy",
  "Others",
];

export const getFeedbackSurveys = [
  {
    title:
      "During this week of using nicotine pouch, how long would you say that you left the nicotine pouch in your mouth while using it?",
    response: undefined,
    selections: minutesChoices,
  },
  {
    title: "How well you think you LIKED or DISLIKED this product",
    response: undefined,
    selections: likeChoices,
  },
  {
    title:
      "Which statement best describes your usage of this product if this product is available in the market?",
    response: undefined,
    selections: usageChoices,
  },
  {
    title:
      "What is your opinion of the strength of sensation (ie tingling) in your mouth?",
    response: undefined,
    selections: opinionChoices,
  },
  {
    title:
      "What do you like this product? What perform well for you or surprise/impress you? Any others?",
    response: undefined,
    selections: productLikeChoices,
  },
  {
    title:
      "What do you dislike this product? What perform not well for you or make you worried/hesitate of using it? Any others?",
    response: undefined,
    selections: productDislikeChoices,
  },
  // {
  //     title: "Thank you very much for your participation, if i may ask, what made you want to stop using this product?",
  //     response: undefined,
  //     selections: productDislikeChoices
  // }
];

export const getFeedbackSurveysMockData = [
  {
    title:
      "During this week of using nicotine pouch, how long would you say that you left the nicotine pouch in your mouth while using it?",
    response: "9 - More than 60 minutes",
    selections: minutesChoices,
  },
  {
    title: "How well you think you LIKED or DISLIKED this product",
    response: "LIKED",
    selections: ["LIKED", "DISLIKED"],
  },
  {
    title:
      "Which statement best describes your usage of this product if this product is available in the market?",
    response: "USAGE1",
    selections: ["USAGE1", "USAGE2"],
  },
  {
    title:
      "What is your opinion of the strength of sensation (ie tingling) in your mouth?",
    response: "OPINION1",
    selections: ["OPINION1", "OPINION2"],
  },
  {
    title:
      "What do you like this product? What perform well for you or surprise/impress you? Any others?",
    response: "LIKE1",
    selections: ["LIKE1", "LIKE2"],
  },
  {
    title:
      "What do you dislike this product? What perform not well for you or make you worried/hesitate of using it? Any others?",
    response: "DISLIKE1",
    selections: ["DISLIKE1", "DISLIKE2"],
  },
  {
    title:
      "Which occasions/moments/times of the day do you typically use this product?",
    response: "MORNING",
    selections: ["MORNING", "AFTERNOON", "NIGHT"],
  },
  {
    title:
      "[Ask for each NP moment], during your usage of this product[mention moment], did this replace your usual nicotine/tobacco product or this is a new/different moment/occasion/time for this product only?",
    response: "YES",
    selections: ["YES", "NO"],
  },
  // {
  //     title: "Thank you very much for your participation, if i may ask, what made you want to stop using this product?",
  //     response: "REASON1",
  //     selections: ["REASON1", "REASON2"]
  // }
];

const feedbackMomentSelections = [
  "N/A",
  "Replace nicotine/tobacco product",
  "New/different moment/occasion/time",
];

export const getFeedbackMomentsQuestions = [
  {
    title: "(MORNING) At home, Before going to work",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(MORNING) On the way to work/commuting",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(MORNING) work break",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(MORNING) lunch break",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(AFTERNOON) While working",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(AFTERNOON) Work break",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(AFTERNOON) On the way home/commuting",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(NIGHT) at home before meals/supper/dinner",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "(NIGHT) at home after meals/supper/dinner",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
  {
    title: "",
    response: "N/A",
    selections: feedbackMomentSelections,
  },
];

export const getRegistrationChannels = [
  "Direct Retail",
  "IQOS",
  "Marlboro",
  "IR - Designated Vaping Areas",
  "IR - Tobacconist",
  "IR - LAMPs",
];
