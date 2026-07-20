class ApiCost:

    INPUT_PRICE = 0.30
    OUTPUT_PRICE = 2.50

    @staticmethod
    def calculate(

        input_tokens,

        output_tokens

    ):

        return (

            input_tokens * ApiCost.INPUT_PRICE +

            output_tokens * ApiCost.OUTPUT_PRICE

        ) / 1_000_000