
from deploy.support.database import Database
from deploy.util.config import get_config

def get_metrics(params):

    config = get_config()

    database = Database(config["deploy"]["metrics_table_name"], config)

    all_metrics = database.all()

    metrics = []

    for metric in all_metrics:
        for key, value in metric.items():
            metrics.append({
                "name" : key,
                "value" : value
            })

    return metrics

