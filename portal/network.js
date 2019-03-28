class Network {

  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_rate = 0.5;
  }

  predict(inputs_arr) {
    var inputs = Matrix.fromArray(inputs_arr);
    var hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    var outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    return outputs.toArray();
  }

  train(inputs_arr, targets_arr) {
    var inputs = Matrix.fromArray(inputs_arr);

    var hidden = Matrix.multiply(this.weights_ih, inputs);

    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    var outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    var targets = Matrix.fromArray(targets_arr);
    var output_errors = Matrix.subtract(targets, outputs);

    var output_gradients = Matrix.map(outputs, dsigmoid);
    output_gradients.multiply(output_errors);
    output_gradients.multiply(this.learning_rate);
    var hidden_t = Matrix.transpose(hidden);
    var weights_ho_delta = Matrix.multiply(output_gradients, hidden_t);

    this.weights_ho.add(weights_ho_delta);
    this.bias_o.add(output_gradients);

    var weights_ho_t = Matrix.transpose(this.weights_ho);
    var hidden_errors = Matrix.multiply(weights_ho_t, output_errors);

    var hidden_gradients = Matrix.map(hidden, dsigmoid);
    hidden_gradients.multiply(hidden_errors);
    hidden_gradients.multiply(this.learning_rate);
    var inputs_t = Matrix.transpose(inputs);
    var weights_ih_delta = Matrix.multiply(hidden_gradients, inputs_t);

    this.weights_ih.add(weights_ih_delta);
    this.bias_h.add(hidden_gradients);
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  return y * (1 - y);
}
