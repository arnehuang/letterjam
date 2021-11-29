import argparse
import os

if __name__ == '__main__':
    from app import create_app

    application = create_app()

    application.secret_key = 'donthackme' #os.environ['FLASK_SECRET_KEY']
    # parser = argparse.ArgumentParser()
    # parser.add_argument('-prod',action = 'store_true')
    #
    # args = parser.parse_args()
    #
    # if args.prod:
    #
    #     port = int(os.environ.get('PORT', 5000))
    #
    #     application.run(host='0.0.0.0', port=port, debug=False)
    # else:
    application.run(host='0.0.0.0', port=5000, debug=True)
