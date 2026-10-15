// Fictional meeting transcript for the demo. Names, numbers and companies are made up.
export const SAMPLE_TRANSCRIPT = `KawaPay Product Sync — Weekly Meeting Transcript
Location: Mbarara office and remote
Attendees: Grace Atuhaire (Product Lead), Daniel Mugisha (Engineering Lead), Sarah Namutebi (Design), Peter Okello (Field Operations), Aisha Nakato (Data & Analytics)

Grace: Okay, let's get started, we have a lot to cover today. Thanks everyone for joining, and welcome to Peter who just got back from the field visits in Ibanda and Bushenyi. The agenda: first, the pilot results from the coffee cooperatives. Second, the offline sync problem that keeps coming up. Third, whether we keep the Python summarization service or move it into the Next.js app. And finally, the launch date for version two. Peter, do you want to kick us off with the pilot?

Peter: Sure. So we ran the pilot with four cooperatives over six weeks. In total we onboarded about 1,240 farmers, which is more than the 1,000 we were targeting. The headline is that farmers love getting paid on the spot through mobile money instead of waiting two or three weeks for the cooperative to pay out in cash. In Ibanda, one of the chairpersons told me that disputes about weights dropped almost to zero, because the farmer sees the weight and the price on the receipt right away.

Grace: That's great to hear. What about the problems?

Peter: The biggest problem is connectivity, no surprise there. At two of the collection centres, the network goes down for hours, sometimes most of the afternoon. The agents record the deliveries offline, but when the network comes back, some transactions fail to sync, and we had duplicate payments in eleven cases. Eleven doesn't sound like a lot, but each one is a real farmer and a real amount of money, and it damages trust with the cooperative managers.

Daniel: Yeah, I looked at those eleven cases. In every one of them the agent pressed "retry" while the first request was still in flight. The phone thought it failed because of a timeout, but the server actually processed it. So we got the payment twice.

Grace: So what's the fix?

Daniel: Idempotency keys. Every delivery record gets a unique ID generated on the phone at the moment it's captured, and the server refuses to process the same ID twice. It's a standard pattern; we should have done it from day one honestly. I estimate about a week of work including testing, and we need to backfill the existing pending records.

Grace: Okay, let's make that the top priority. Nothing else ships before the duplicate payment fix. Is everyone okay with that?

Sarah: Agreed.

Aisha: Agreed, and I'd like to add a reconciliation report so we can catch any duplicates that already slipped through. I can query the transactions table and flag any pair of payments to the same phone number with the same amount within ten minutes.

Grace: Perfect, please do that. Daniel owns the idempotency fix, Aisha owns the reconciliation report. Let's aim to have both done by the end of next week.

Peter: One more thing from the field. Agents said the app is too slow on the cheap Android phones, the ones with one or two gigabytes of RAM. Opening the delivery screen takes something like eight seconds.

Sarah: I can speak to that a bit. The delivery screen loads the full farmer list for the cooperative, which can be two or three thousand people, with photos. We designed it for search, but we're rendering everything up front. I've got a design for a search-first screen where you type the farmer's name or member number and we only load matches. It also has bigger buttons, because Peter mentioned agents working in the sun with dusty screens.

Peter: Yes, the bigger buttons will help a lot. And a high-contrast mode, the screens are really hard to read outside.

Sarah: High-contrast mode is in the design. I'll share the Figma link after this call.

Grace: Good. Daniel, can engineering pick that up after the sync fix?

Daniel: Yes, it's maybe three or four days of front-end work once Sarah's design is final.

Grace: Okay. Moving to the second big topic, the summarization service. For context for everyone: cooperative managers get a lot of long documents, meeting minutes, buyer contracts, export regulations, and in the pilot we tested a feature that summarizes those documents and lets managers ask follow-up questions. Right now that runs on a separate Python service with FastAPI. Daniel, you wanted to propose a change.

Daniel: Right. So the Python service works, but it's a second deployment, a second language, a second set of dependencies, and honestly most of the code is just calling the model API and streaming the result back. We have a whole service and a container just to forward HTTP requests. My proposal is to move it into the Next.js app using the Vercel AI SDK. The SDK gives us generateText for one-shot answers, streamText for streaming, structured output with Zod schemas so we get typed JSON back, and the useChat hook on the front end for the follow-up questions. The route handlers run on the server, so the API key never reaches the browser.

Aisha: What about the analytics we do in Python? I have some notebooks that use pandas on the summaries.

Daniel: Those can stay. That's offline analysis, it's not in the request path. I'm only talking about the part that serves users. If we need heavy data science later, we can call a Python job for that specifically. But for calling a model and streaming text, we don't need a Python backend.

Grace: What's the risk?

Daniel: Mainly timeouts on long documents. Serverless functions have a maximum duration, so we set it to thirty or sixty seconds and we stream, so the user sees progress immediately. And we should cap the document size. I'd say around sixty thousand characters for now; anything longer we can chunk later.

Sarah: From the design side, streaming is a big win. In the pilot, managers waited ten to fifteen seconds staring at a spinner and some of them thought the app had frozen. If the summary starts appearing word by word in under a second, it feels much faster even if the total time is the same.

Grace: And the structured part, what does that give us?

Daniel: Instead of just a paragraph, we can ask for an object: a title, key points, decisions, action items with owners, sentiment, topics. The Zod schema defines it, and the SDK validates the response against it. On the front end we can render cards for action items instead of parsing text. It even streams partially, so the cards fill in as the model writes.

Aisha: That would make my job easier too. If action items come back as structured data, I can count them and track completion without any text parsing.

Grace: Okay, I'm convinced. Decision: we migrate the summarization feature from the Python service into the Next.js app with the AI SDK, and we decommission the FastAPI service once the new version has run in production for two weeks without issues. Daniel, you own the migration. Any objections?

Peter: No objection, as long as the field agents don't notice anything except it being faster.

Grace: Noted. Last topic: launch date for version two. We had pencilled in the first of next month. Given that the duplicate payment fix is now the top priority, is that still realistic?

Daniel: The sync fix is one week, the summarization migration is about a week, and the search-first delivery screen is three to four days. With testing, I think the first of the month is too tight. I'd rather say the fifteenth.

Peter: The fifteenth also works better for the cooperatives. The main harvest season starts around then, and they want the new version before the peak, not in the middle of it. Changing the app during peak harvest would be a nightmare for the agents.

Grace: Then let's move the launch to the fifteenth. Decision: version two launches on the fifteenth, with the duplicate payment fix as a hard requirement. If the sync fix isn't verified in the field by the tenth, we delay the launch rather than ship without it.

Sarah: Should we do another round of field testing before launch?

Peter: Yes, I'd like to take the new build to Ibanda for two days, around the eighth or ninth, and test with real agents on the cheap phones, with the network switched off.

Grace: Good, Peter owns the field test. Aisha, can you prepare a short dashboard for the field test so we can see sync failures in real time?

Aisha: Yes. I'll have it ready by the seventh.

Grace: Great. Let me recap the action items. Daniel: idempotency fix for offline sync, by end of next week, then the summarization migration to Next.js and the AI SDK. Aisha: duplicate payment reconciliation report by end of next week, and the field test dashboard by the seventh. Sarah: share the search-first delivery screen design and high-contrast mode today, final design by Wednesday. Peter: field test in Ibanda on the eighth and ninth, and tell the cooperative chairpersons about the new launch date. And I'll update the investors and the board on the pilot numbers and the new date.

Peter: One concern before we close. Some cooperative managers asked whether the summaries can be in Runyankore, not just English. Many of the members' meeting minutes are written in Runyankore.

Grace: That's a good point. Daniel, is that hard?

Daniel: The model can handle it reasonably well, but we'd need to test quality carefully. I'd treat it as a follow-up experiment, not part of version two.

Grace: Agreed. Let's park Runyankore summaries as an open question for the next planning cycle. Aisha, maybe you can collect a few sample documents so we can evaluate quality.

Aisha: Sure, I'll ask Peter's contacts for some anonymised minutes.

Grace: Alright, thank you everyone. Good meeting. The pilot numbers are really encouraging, so let's not lose that momentum by shipping something that double-pays farmers. See you next week.`;
