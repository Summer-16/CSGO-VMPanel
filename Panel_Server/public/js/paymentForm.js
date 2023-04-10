const paymentForm = (gateway = "payU") => {
  return `<p>Enter following details and proceed</p>
            <br>
            <form class="col-md-12">
              <div class="row">
                  <div class="col-md-12">
                    <div class="form-group bmd-form-group">
                        <label class="">Enter Name</label>
                        <input type="text" name="firstname" id="${gateway}firstname" class="form-control" required>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group bmd-form-group">
                        <label class="">Enter Mobile No</label>
                        <input type="number" name="mobile" id="${gateway}mobile" class="form-control" required>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group bmd-form-group">
                        <label class="">Enter email</label>
                        <input type="email" name="email" id="${gateway}email" class="form-control" required>
                    </div>
                  </div>
              </div>
            </form>`;
};
