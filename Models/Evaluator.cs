namespace BridgeScenarios.Models;

public static class Evaluator
{
    private class EvaluatorBase(Dictionary<char, int> dict) : IEvaluator
    {
        private Dictionary<char, int> _dict = dict;

        public int Apply(string suit)
        {
            var total = 0;
            foreach (char c in suit)
            {
                if (!_dict.ContainsKey(c))
                    continue;

                total += _dict[c];
            }

            return total;
        }
    }
    
    public static IEvaluator FromDictionary(Dictionary<char, int> dict)
    {
        return new EvaluatorBase(dict);
    }

    public static IEvaluator Hcp = new EvaluatorBase(new Dictionary<char, int>
    {
        { 'A', 4 }, { 'K', 3 }, { 'Q', 2 }, { 'J', 1 }
    });

    public static IEvaluator Controls = new EvaluatorBase(new Dictionary<char, int>
    {
        {'A', 2}, {'K', 1}
    });
}