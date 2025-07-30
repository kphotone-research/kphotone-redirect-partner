import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qbezfrqsojypxpmyblbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZXpmcnFzb2p5cHhwbXlibGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjIxNDgsImV4cCI6MjA1OTU5ODE0OH0.FwfbMTlfPQ17OpoMXR3zDL13lwHwm3QlblV5dmHfEVc'
);

export default async function handler(req, res) {
  const { project_id, sid, survey_id } = req.query;

  if (!project_id || !sid || !survey_id) {
    return res.status(400).send("Missing required parameters.");
  }

  const { data, error } = await supabase
    .from('survey_links')
    .select('actual_survey_base_url, masked_survey_id')
    .eq('project_id', project_id)
    .eq('sid', sid)
    .eq('original_survey_id', survey_id)
    .single();

  if (error || !data) {
    return res.status(404).send("Survey not found.");
  }

  const finalUrl = `${data.actual_survey_base_url}/${data.masked_survey_id}`;
  return res.redirect(302, finalUrl);
}
