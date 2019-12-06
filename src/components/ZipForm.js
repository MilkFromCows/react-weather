import React from 'react';

class ZipForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zipcode: '',
        }

        this.inputChanged = this.inputChanged.bind(this);
    }

    inputChanged(e) {
        const {value} = e.target;
        this.setState( {zipcode: value} );
    }

    render() {
        return (
            <div className="zip-form">
                <form id="zipForm">
                    <div className="flex-parent">
                        <label htmlFor="zipcode">Zip</label>
                        <input className="form-control" type="text" id="zipcode" name="zipcode" onChange={this.inputChanged} value={this.state.zipcode} required />
                        <button type="submit" className="btn btn-success"> Get the forecast!</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ZipForm;